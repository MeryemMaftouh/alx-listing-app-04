// pages/api/properties.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PROPERTYLISTINGSAMPLE } from "@/constants";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(PROPERTYLISTINGSAMPLE);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
