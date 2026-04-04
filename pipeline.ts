import { mapDefined } from "@atp/common";
import { HydrationState } from "./hydration/index.ts";

export type SkeletonFn<Context, Params, Skeleton> = (
  input: SkeletonFnInput<Context, Params>,
) => Promise<Skeleton> | Skeleton;

export type HydrationFn<Context, Params, Skeleton> = (
  input: HydrationFnInput<Context, Params, Skeleton>,
) => Promise<HydrationState>;

export type RulesFn<Context, Params, Skeleton> = (
  input: RulesFnInput<Context, Params, Skeleton>,
) => Skeleton;

export type PresentationFn<Context, Params, Skeleton, View> = (
  input: PresentationFnInput<Context, Params, Skeleton>,
) => View;

export type PipelineDefinition<Params, Skeleton, View, Context> = {
  skeleton: SkeletonFn<Context, Params, Skeleton>;
  hydration: HydrationFn<Context, Params, Skeleton>;
  rules?: RulesFn<Context, Params, Skeleton>;
  presentation: PresentationFn<Context, Params, Skeleton, View>;
};

export function createPipeline<Params, Skeleton, View, Context>(
  definition: PipelineDefinition<Params, Skeleton, View, Context>,
): (params: Params, ctx: Context) => Promise<View>;
export function createPipeline<Params, Skeleton, View, Context>(
  definition: PipelineDefinition<Params, Skeleton, View, Context>,
) {
  const applyRules = definition.rules ??
    ((input: RulesFnInput<Context, Params, Skeleton>) => input.skeleton);

  return async (params: Params, ctx: Context) => {
    const skeleton = await definition.skeleton({ ctx, params });
    const hydration = await definition.hydration({ ctx, params, skeleton });
    const appliedRules = applyRules({ ctx, params, skeleton, hydration });
    return definition.presentation({
      ctx,
      params,
      skeleton: appliedRules,
      hydration,
    });
  };
}

export type SkeletonFnInput<Context, Params> = {
  ctx: Context;
  params: Params;
};

export type HydrationFnInput<Context, Params, Skeleton> = {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
};

export type RulesFnInput<Context, Params, Skeleton> = {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
  hydration: HydrationState;
};

export type PresentationFnInput<Context, Params, Skeleton> = {
  ctx: Context;
  params: Params;
  skeleton: Skeleton;
  hydration: HydrationState;
};

type SkeletonListKey<S> = {
  [K in keyof S]: S[K] extends readonly unknown[] ? K : never;
}[keyof S];

type SkeletonListItem<T> = T extends readonly (infer Item)[] ? Item : never;

export function filterSkeletonList<
  Skeleton extends Record<string, unknown>,
  Key extends SkeletonListKey<Skeleton>,
>(
  skeleton: Skeleton,
  key: Key,
  predicate: (item: SkeletonListItem<Skeleton[Key]>) => boolean,
): Skeleton {
  const items = skeleton[key] as SkeletonListItem<Skeleton[Key]>[];
  return {
    ...skeleton,
    [key]: items.filter(predicate),
  } as Skeleton;
}

export function mapSkeletonList<
  Skeleton extends Record<string, unknown>,
  Key extends SkeletonListKey<Skeleton>,
  View,
>(
  skeleton: Skeleton,
  key: Key,
  mapper: (item: SkeletonListItem<Skeleton[Key]>) => View | undefined,
): View[] {
  const items = skeleton[key] as SkeletonListItem<Skeleton[Key]>[];
  return mapDefined(items, mapper);
}
