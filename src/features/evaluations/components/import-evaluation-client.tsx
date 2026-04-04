"use client";

import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import {
  EvaluationImportSchema,
  importJsonToManualFormValues,
  type EvaluationImport,
} from "../schemas/evaluation-import-schema";
import { NewEvaluationForm } from "./new-evaluation-form";
import { RichImportPreview } from "./rich-import-preview";

function normalizeName(s: string): string {
  return s.trim().toLowerCase();
}

function formatZodPath(path: ReadonlyArray<unknown>): string {
  if (path.length === 0) return "(root)";
  return path.map((p) => String(p)).join(".");
}

type Props = {
  playerId: string;
  playerName: string;
  expectedFullName: string;
};

export function ImportEvaluationClient({
  playerId,
  playerName,
  expectedFullName,
}: Props) {
  const [parseError, setParseError] = useState<string | null>(null);
  const [zodIssues, setZodIssues] = useState<
    { path: string; message: string }[] | null
  >(null);
  const [imported, setImported] = useState<EvaluationImport | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [nameAcknowledged, setNameAcknowledged] = useState(false);

  const nameMatches = useMemo(() => {
    if (!imported) return true;
    return (
      normalizeName(imported.player) === normalizeName(expectedFullName)
    );
  }, [imported, expectedFullName]);

  const onFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setParseError(null);
    setZodIssues(null);
    setImported(null);
    setNameAcknowledged(false);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const obj: unknown = JSON.parse(text);
        const parsed = EvaluationImportSchema.safeParse(obj);
        if (!parsed.success) {
          setZodIssues(
            parsed.error.issues.map((issue) => ({
              path: formatZodPath(issue.path),
              message: issue.message,
            })),
          );
          return;
        }
        setImported(parsed.data);
        setFormKey((k) => k + 1);
      } catch {
        setParseError(
          "This file is not valid JSON. Check the file and try again.",
        );
      }
    };
    reader.onerror = () => {
      setParseError("Could not read the file. Try again.");
    };
    reader.readAsText(file);
  }, []);

  const showForm =
    imported != null && (nameMatches || nameAcknowledged);

  const manualDefaults =
    imported != null ? importJsonToManualFormValues(imported) : null;

  const useRichFlow = imported?.rich_report != null;

  return (
    <div className="mt-6 space-y-6">
      <div>
        <label
          htmlFor="evaluation-json-file"
          className="text-sm text-cfl-gray"
        >
          JSON file
        </label>
        <input
          id="evaluation-json-file"
          type="file"
          accept=".json,application/json"
          onChange={onFile}
          className="mt-2 block w-full max-w-md text-sm text-cfl-gray file:mr-4 file:rounded file:border-0 file:bg-cfl-gold file:px-4 file:py-2 file:font-medium file:text-cfl-navy hover:file:bg-cfl-gold/90"
        />
      </div>

      {parseError ? (
        <p
          className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {parseError}
        </p>
      ) : null}

      {zodIssues && zodIssues.length > 0 ? (
        <div
          className="rounded border border-red-500/40 bg-red-500/10 px-3 py-3 text-sm text-red-200"
          role="alert"
        >
          <p className="font-medium text-red-100">Fix these issues:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {zodIssues.map((issue, i) => (
              <li key={`${issue.path}-${i}`}>
                <span className="font-mono text-xs text-red-100/90">
                  {issue.path}
                </span>
                : {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {imported != null && !nameMatches && !nameAcknowledged ? (
        <div className="rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p>
            This file lists player{" "}
            <span className="font-medium text-cfl-white">
              &quot;{imported.player}&quot;
            </span>{" "}
            but you are importing for{" "}
            <span className="font-medium text-cfl-white">
              &quot;{expectedFullName}&quot;
            </span>
            .
          </p>
          <label className="mt-3 flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={nameAcknowledged}
              onChange={(ev) => setNameAcknowledged(ev.target.checked)}
              className="mt-1 size-4 shrink-0 rounded border-cfl-gold/40 bg-cfl-navy-light text-cfl-gold focus:ring-cfl-gold"
            />
            <span>
              I understand the file is for &quot;{imported.player}&quot; and I
              still want to continue on this profile.
            </span>
          </label>
        </div>
      ) : null}

      {showForm && useRichFlow && imported ? (
        <RichImportPreview
          key={formKey}
          playerId={playerId}
          playerName={playerName}
          data={imported}
        />
      ) : null}

      {showForm && !useRichFlow && manualDefaults ? (
        <NewEvaluationForm
          key={formKey}
          playerId={playerId}
          playerName={playerName}
          defaultValues={manualDefaults}
          previewHint={`Imported for: ${imported!.player}`}
        />
      ) : null}
    </div>
  );
}
