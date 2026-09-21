import { redirect } from "next/navigation";

/**
 * /audit is the short link used in the marketing content calendars.
 * It permanently forwards to the canonical funnel URL so links in social posts,
 * emails and the lead magnet keep working.
 */
export default function AuditRedirect() {
  redirect("/business-audit");
}
