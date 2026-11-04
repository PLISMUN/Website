export const SUPERVISOR_APPLY_PATH = "/user/supervisor/apply"
export const SUPERVISOR_INFO_PATH = "/supervisors"

export const supervisorApplyHref = (signedIn: boolean) =>
  signedIn ? SUPERVISOR_APPLY_PATH : `/user/signup?next=${encodeURIComponent(SUPERVISOR_APPLY_PATH)}`
