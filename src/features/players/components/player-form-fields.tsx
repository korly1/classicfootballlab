"use client";

import { useFormContext } from "react-hook-form";

import type { PlayerFormValues } from "../schemas/player-form-schema";

const inputClass =
  "rounded border border-cfl-gold/30 bg-cfl-navy-light px-3 py-2 text-cfl-white placeholder:text-cfl-gray/60 focus:border-cfl-gold focus:outline-none";

export function PlayerFormFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlayerFormValues>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-cfl-gray" htmlFor="full_name">
          Full name <span className="text-red-400">*</span>
        </label>
        <input
          id="full_name"
          type="text"
          autoComplete="name"
          className={inputClass}
          {...register("full_name")}
        />
        {errors.full_name ? (
          <p className="text-sm text-red-400">{errors.full_name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-cfl-gray" htmlFor="birth_year">
          Birth year
        </label>
        <input
          id="birth_year"
          type="number"
          inputMode="numeric"
          min={1990}
          max={new Date().getFullYear() + 1}
          placeholder="e.g. 2012"
          className={inputClass}
          {...register("birth_year")}
        />
        {errors.birth_year ? (
          <p className="text-sm text-red-400">{errors.birth_year.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cfl-gray" htmlFor="club">
            Club
          </label>
          <input id="club" type="text" className={inputClass} {...register("club")} />
          {errors.club ? (
            <p className="text-sm text-red-400">{errors.club.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cfl-gray" htmlFor="level">
            Level
          </label>
          <input id="level" type="text" className={inputClass} {...register("level")} />
          {errors.level ? (
            <p className="text-sm text-red-400">{errors.level.message}</p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-cfl-gold/15 pt-4">
        <p className="mb-3 text-sm font-medium text-cfl-gray">Parent / guardian</p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cfl-gray" htmlFor="parent_name">
              Name
            </label>
            <input
              id="parent_name"
              type="text"
              className={inputClass}
              {...register("parent_name")}
            />
            {errors.parent_name ? (
              <p className="text-sm text-red-400">{errors.parent_name.message}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cfl-gray" htmlFor="parent_phone">
                Phone
              </label>
              <input
                id="parent_phone"
                type="tel"
                className={inputClass}
                {...register("parent_phone")}
              />
              {errors.parent_phone ? (
                <p className="text-sm text-red-400">{errors.parent_phone.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cfl-gray" htmlFor="parent_email">
                Email
              </label>
              <input
                id="parent_email"
                type="email"
                className={inputClass}
                {...register("parent_email")}
              />
              {errors.parent_email ? (
                <p className="text-sm text-red-400">{errors.parent_email.message}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-cfl-gray" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          className={`${inputClass} resize-y`}
          {...register("notes")}
        />
        {errors.notes ? (
          <p className="text-sm text-red-400">{errors.notes.message}</p>
        ) : null}
      </div>
    </div>
  );
}
