"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchTours } from "@/lib/store/toursSlice";

/** Dispara la carga de tours del backend una sola vez (sin UI). */
export default function ToursLoader() {
  const dispatch = useAppDispatch();
  const listStatus = useAppSelector((state) => state.tours.listStatus);

  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchTours());
  }, [dispatch, listStatus]);

  return null;
}
