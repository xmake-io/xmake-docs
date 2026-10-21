export interface Sponsor {
  name: string
  url: string
  logo: string
  logoDark?: string
}

// Add confirmed sponsors only; entries display in array order.
// Each entry needs name, url and logo; logoDark is optional.
// Store logos in docs/public/assets/sponsors; use /assets/sponsors/... URLs.
export const platinumSponsors: Sponsor[] = []

export const goldSponsors: Sponsor[] = []
