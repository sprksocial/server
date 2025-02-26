import assert from "node:assert";

export interface ServerConfigValues {
    // service
    version?: string
    debugMode?: boolean
    port?: number
    publicUrl?: string
    serverDid: string
    alternateAudienceDids: string[]
    entrywayJwtPublicKeyHex?: string
    // external services
    dataplaneUrls: string[]
    dataplaneHttpVersion?: '1.1' | '2'
    dataplaneIgnoreBadTls?: boolean
    courierUrl?: string
    courierApiKey?: string
    courierHttpVersion?: '1.1' | '2'
    courierIgnoreBadTls?: boolean
    searchUrl?: string
    suggestionsUrl?: string
    suggestionsApiKey?: string
    topicsUrl?: string
    topicsApiKey?: string
    cdnUrl?: string
    videoPlaylistUrlPattern?: string
    videoThumbnailUrlPattern?: string
    blobRateLimitBypassKey?: string
    blobRateLimitBypassHostname?: string
    // identity
    didPlcUrl: string
    handleResolveNameservers?: string[]
    // moderation and administration
    modServiceDid: string
    adminPasswords: string[]
    labelsFromIssuerDids?: string[]
    indexedAtEpoch?: Date
    // misc/dev
    blobCacheLocation?: string
    // threads
    bigThreadUris: Set<string>
    bigThreadDepth?: number
    maxThreadDepth?: number
    // client config
    clientCheckEmailConfirmed?: boolean
    topicsEnabled?: boolean
    // http proxy agent
    disableSsrfProtection?: boolean
    proxyAllowHTTP2?: boolean
    proxyHeadersTimeout?: number
    proxyBodyTimeout?: number
    proxyMaxResponseSize?: number
    proxyMaxRetries?: number
    proxyPreferCompressed?: boolean
}

export class ServerConfig {
    private assignedPort?: number
    constructor(private cfg: ServerConfigValues) {}

    static readEnv(overrides?: Partial<ServerConfigValues>) {
        const version = process.env.SPKR_VERSION || undefined
        const debugMode =
            // Because security related features are disabled in development mode, this requires explicit opt-in.
            process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
        const publicUrl = process.env.SPKR_PUBLIC_URL || undefined
        const serverDid = process.env.SPKR_SERVER_DID || 'did:example:test'
        const envPort = parseInt(process.env.SPKR_PORT || '', 10)
        const port = isNaN(envPort) ? 2584 : envPort
        const didPlcUrl = process.env.SPKR_DID_PLC_URL || 'http://localhost:2582'
        const alternateAudienceDids = process.env.SPKR_ALT_AUDIENCE_DIDS
            ? process.env.SPKR_ALT_AUDIENCE_DIDS.split(',')
            : []
        const entrywayJwtPublicKeyHex =
            process.env.SPKR_ENTRYWAY_JWT_PUBLIC_KEY_HEX || undefined
        const handleResolveNameservers = process.env.SPKR_HANDLE_RESOLVE_NAMESERVERS
            ? process.env.SPKR_HANDLE_RESOLVE_NAMESERVERS.split(',')
            : []
        const cdnUrl = process.env.SPKR_CDN_URL || process.env.SPKR_IMG_URI_ENDPOINT
        // e.g. https://video.invalid/watch/%s/%s/playlist.m3u8
        const videoPlaylistUrlPattern = process.env.SPKR_VIDEO_PLAYLIST_URL_PATTERN
        // e.g. https://video.invalid/watch/%s/%s/thumbnail.jpg
        const videoThumbnailUrlPattern =
            process.env.SPKR_VIDEO_THUMBNAIL_URL_PATTERN
        const blobCacheLocation = process.env.SPKR_BLOB_CACHE_LOC
        const searchUrl =
            process.env.SPKR_SEARCH_URL ||
            process.env.SPKR_SEARCH_ENDPOINT ||
            undefined
        const suggestionsUrl = process.env.SPKR_SUGGESTIONS_URL || undefined
        const suggestionsApiKey = process.env.SPKR_SUGGESTIONS_API_KEY || undefined
        const topicsUrl = process.env.SPKR_TOPICS_URL || undefined
        const topicsApiKey = process.env.SPKR_TOPICS_API_KEY
        let dataplaneUrls = overrides?.dataplaneUrls
        dataplaneUrls ??= process.env.SPKR_DATAPLANE_URLS
            ? process.env.SPKR_DATAPLANE_URLS.split(',')
            : []
        const dataplaneHttpVersion = process.env.SPKR_DATAPLANE_HTTP_VERSION || '2'
        const dataplaneIgnoreBadTls =
            process.env.SPKR_DATAPLANE_IGNORE_BAD_TLS === 'true'
        const labelsFromIssuerDids = process.env.SPKR_LABELS_FROM_ISSUER_DIDS
            ? process.env.SPKR_LABELS_FROM_ISSUER_DIDS.split(',')
            : []

        // Courier
        const courierUrl = process.env.SPKR_COURIER_URL || undefined
        const courierApiKey = process.env.SPKR_COURIER_API_KEY || undefined
        const courierHttpVersion = process.env.SPKR_COURIER_HTTP_VERSION || '2'
        const courierIgnoreBadTls =
            process.env.SPKR_COURIER_IGNORE_BAD_TLS === 'true'
        assert(courierHttpVersion === '1.1' || courierHttpVersion === '2')

        // Rate limiting
        const blobRateLimitBypassKey =
            process.env.SPKR_BLOB_RATE_LIMIT_BYPASS_KEY || undefined
        // single domain would be e.g. "mypds.com", subdomains are supported with a leading dot e.g. ".mypds.com"
        const blobRateLimitBypassHostname =
            process.env.SPKR_BLOB_RATE_LIMIT_BYPASS_HOSTNAME || undefined
        assert(
            !blobRateLimitBypassKey || blobRateLimitBypassHostname,
            'must specify a hostname when using a blob rate limit bypass key',
        )

        const adminPasswords = envList(
            process.env.SPKR_ADMIN_PASSWORDS || process.env.SPKR_ADMIN_PASSWORD,
        )
        const modServiceDid = process.env.MOD_SERVICE_DID
        assert(modServiceDid)
        assert(dataplaneUrls.length)
        assert(dataplaneHttpVersion === '1.1' || dataplaneHttpVersion === '2')


        const clientCheckEmailConfirmed =
            process.env.SPKR_CLIENT_CHECK_EMAIL_CONFIRMED === 'true'
        const topicsEnabled = process.env.SPKR_TOPICS_ENABLED === 'true'
        const indexedAtEpoch = process.env.SPKR_INDEXED_AT_EPOCH
            ? new Date(process.env.SPKR_INDEXED_AT_EPOCH)
            : undefined
        assert(
            !indexedAtEpoch || !isNaN(indexedAtEpoch.getTime()),
            'invalid SPKR_INDEXED_AT_EPOCH',
        )
        const bigThreadUris = new Set(envList(process.env.SPKR_BIG_THREAD_URIS))
        const bigThreadDepth = process.env.SPKR_BIG_THREAD_DEPTH
            ? parseInt(process.env.SPKR_BIG_THREAD_DEPTH || '', 10)
            : undefined
        const maxThreadDepth = process.env.SPKR_MAX_THREAD_DEPTH
            ? parseInt(process.env.SPKR_MAX_THREAD_DEPTH || '', 10)
            : undefined

        const disableSsrfProtection = process.env.SPKR_DISABLE_SSRF_PROTECTION
            ? process.env.SPKR_DISABLE_SSRF_PROTECTION === 'true'
            : debugMode

        const proxyAllowHTTP2 = process.env.SPKR_PROXY_ALLOW_HTTP2 === 'true'
        const proxyHeadersTimeout =
            parseInt(process.env.SPKR_PROXY_HEADERS_TIMEOUT || '', 10) || undefined
        const proxyBodyTimeout =
            parseInt(process.env.SPKR_PROXY_BODY_TIMEOUT || '', 10) || undefined
        const proxyMaxResponseSize =
            parseInt(process.env.SPKR_PROXY_MAX_RESPONSE_SIZE || '', 10) || undefined
        const proxyMaxRetries =
            parseInt(process.env.SPKR_PROXY_MAX_RETRIES || '', 10) || undefined
        const proxyPreferCompressed =
            process.env.SPKR_PROXY_PREFER_COMPRESSED === 'true'

        return new ServerConfig({
            version,
            debugMode,
            port,
            publicUrl,
            serverDid,
            alternateAudienceDids,
            entrywayJwtPublicKeyHex,
            dataplaneUrls,
            dataplaneHttpVersion,
            dataplaneIgnoreBadTls,
            searchUrl,
            suggestionsUrl,
            suggestionsApiKey,
            topicsUrl,
            topicsApiKey,
            didPlcUrl,
            labelsFromIssuerDids,
            handleResolveNameservers,
            cdnUrl,
            videoPlaylistUrlPattern,
            videoThumbnailUrlPattern,
            blobCacheLocation,
            courierUrl,
            courierApiKey,
            courierHttpVersion,
            courierIgnoreBadTls,
            blobRateLimitBypassKey,
            blobRateLimitBypassHostname,
            adminPasswords,
            modServiceDid,
            clientCheckEmailConfirmed,
            topicsEnabled,
            indexedAtEpoch,
            bigThreadUris,
            bigThreadDepth,
            maxThreadDepth,
            disableSsrfProtection,
            proxyAllowHTTP2,
            proxyHeadersTimeout,
            proxyBodyTimeout,
            proxyMaxResponseSize,
            proxyMaxRetries,
            proxyPreferCompressed,
            ...stripUndefineds(overrides ?? {}),
        })
    }

    assignPort(port: number) {
        assert(
            !this.cfg.port || this.cfg.port === port,
            'Conflicting port in config',
        )
        this.assignedPort = port
    }

    get version() {
        return this.cfg.version
    }

    get debugMode() {
        return !!this.cfg.debugMode
    }

    get port() {
        return this.assignedPort || this.cfg.port
    }

    get publicUrl() {
        return this.cfg.publicUrl
    }

    get serverDid() {
        return this.cfg.serverDid
    }

    get alternateAudienceDids() {
        return this.cfg.alternateAudienceDids
    }

    get entrywayJwtPublicKeyHex() {
        return this.cfg.entrywayJwtPublicKeyHex
    }

    get dataplaneUrls() {
        return this.cfg.dataplaneUrls
    }

    get dataplaneHttpVersion() {
        return this.cfg.dataplaneHttpVersion
    }

    get dataplaneIgnoreBadTls() {
        return this.cfg.dataplaneIgnoreBadTls
    }

    get courierUrl() {
        return this.cfg.courierUrl
    }

    get courierApiKey() {
        return this.cfg.courierApiKey
    }

    get courierHttpVersion() {
        return this.cfg.courierHttpVersion
    }

    get courierIgnoreBadTls() {
        return this.cfg.courierIgnoreBadTls
    }

    get searchUrl() {
        return this.cfg.searchUrl
    }

    get suggestionsUrl() {
        return this.cfg.suggestionsUrl
    }

    get suggestionsApiKey() {
        return this.cfg.suggestionsApiKey
    }

    get topicsUrl() {
        return this.cfg.topicsUrl
    }

    get topicsApiKey() {
        return this.cfg.topicsApiKey
    }

    get cdnUrl() {
        return this.cfg.cdnUrl
    }

    get videoPlaylistUrlPattern() {
        return this.cfg.videoPlaylistUrlPattern
    }

    get videoThumbnailUrlPattern() {
        return this.cfg.videoThumbnailUrlPattern
    }

    get blobRateLimitBypassKey() {
        return this.cfg.blobRateLimitBypassKey
    }

    get blobRateLimitBypassHostname() {
        return this.cfg.blobRateLimitBypassHostname
    }

    get didPlcUrl() {
        return this.cfg.didPlcUrl
    }

    get handleResolveNameservers() {
        return this.cfg.handleResolveNameservers
    }

    get adminPasswords() {
        return this.cfg.adminPasswords
    }

    get modServiceDid() {
        return this.cfg.modServiceDid
    }

    get labelsFromIssuerDids() {
        return this.cfg.labelsFromIssuerDids ?? []
    }

    get blobCacheLocation() {
        return this.cfg.blobCacheLocation
    }

    get clientCheckEmailConfirmed() {
        return this.cfg.clientCheckEmailConfirmed
    }

    get topicsEnabled() {
        return this.cfg.topicsEnabled
    }

    get indexedAtEpoch() {
        return this.cfg.indexedAtEpoch
    }

    get bigThreadUris() {
        return this.cfg.bigThreadUris
    }

    get bigThreadDepth() {
        return this.cfg.bigThreadDepth
    }

    get maxThreadDepth() {
        return this.cfg.maxThreadDepth
    }

    get disableSsrfProtection(): boolean {
        return this.cfg.disableSsrfProtection ?? false
    }

    get proxyAllowHTTP2(): boolean {
        return this.cfg.proxyAllowHTTP2 ?? false
    }

    get proxyHeadersTimeout(): number {
        return this.cfg.proxyHeadersTimeout ?? 30e3
    }

    get proxyBodyTimeout(): number {
        return this.cfg.proxyBodyTimeout ?? 30e3
    }

    get proxyMaxResponseSize(): number {
        return this.cfg.proxyMaxResponseSize ?? 10 * 1024 * 1024 // 10mb
    }

    get proxyMaxRetries(): number {
        return this.cfg.proxyMaxRetries ?? 3
    }

    get proxyPreferCompressed(): boolean {
        return this.cfg.proxyPreferCompressed ?? true
    }
}

function stripUndefineds(
    obj: Record<string, unknown>,
): Record<string, unknown> {
    const result: { [key: string]: unknown } = {}
    Object.entries(obj).forEach(([key, val]) => {
        if (val !== undefined) {
            result[key] = val
        }
    })
    return result
}

function envList(str: string | undefined): string[] {
    if (str === undefined || str.length === 0) return []
    return str.split(',')
}