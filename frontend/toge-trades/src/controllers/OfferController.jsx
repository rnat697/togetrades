import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { acceptOfferAPI, createOffer, declineOfferAPI } from "../api/api";
import { OUTGOING_OFFERS_URL } from "../api/urls";
import useGet from "../hooks/useGet";
import OffersModel from "../models/OffersModel";

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

// ---- Fetches all outgoing offers ----
export function useOutgoingOffers(currentPage) {
  const {
    data: rawData,
    isLoading,
    error,
    refresh,
  } = useGet(OUTGOING_OFFERS_URL, [], true, true, currentPage);
  const [offers, setOffers] = useState([]);
  const [offersMetadata, setOffersMetadata] = useState({});

  useEffect(() => {
    if (rawData.success) {
      let offersData = rawData.data;
      setOffersMetadata(rawData.metadata);

      const offersModels = offersData.map((data) => OffersModel.fromJSON(data));
      setOffers(offersModels);
    }
  }, [rawData]);
  return { offers, isLoading, error, refresh, offersMetadata };
}

export function acceptOffer(offerId) {
  return acceptOfferAPI(offerId)
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
        "Error when accepting a trade offer: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}

export function declineOffer(offerId) {
  return declineOfferAPI(offerId)
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
        "Error when declining a trade offer: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}