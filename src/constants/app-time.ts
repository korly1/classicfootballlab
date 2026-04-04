/**
 * Business convention: session and calendar fields are **Pacific (Los Angeles)
 * civil dates**; coaches enter and read them as PT. `timestamptz` values from the
 * DB are shown in this zone as well.
 */
export const APP_TIME_ZONE = "America/Los_Angeles" as const;
