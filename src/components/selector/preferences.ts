"use client";
import { PreferencesState } from "@/lib/types/common";
import { createSelector } from "@reduxjs/toolkit";
export const getPreferences = createSelector(
  (state: { preferences: PreferencesState }) => state.preferences,
  (preferences) => preferences
);
