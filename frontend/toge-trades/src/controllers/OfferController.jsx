import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createOffer } from "../api/api";

export function createNewOffer(offeredPokeId, listingId) {
  return createOffer(offeredPokeId, listingId)
    .then((res) => {
      if (res.status === 201) {
        const message = res.data.message;
        toast(message);
        // TODO: potential socket.io notification here?
        return res.data.success;
      }
    })
    .catch((e) => {
      toast(
        "Error when creating new trade offer: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}
