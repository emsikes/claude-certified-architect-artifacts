import { open } from "sqlite";
import sqlite3 from "sqlite3";

import { createSchema } from "./schema";
import { getOrdersPendingLongerThanThreeDays } from "./queries/order_queries";

async function main() {
  const db = await open({
    filename: "ecommerce.db",
    driver: sqlite3.Database,
  });

  await createSchema(db, true);

  const pendingOrders = await getOrdersPendingLongerThanThreeDays(db);
  console.log("Orders pending longer than 3 days:", pendingOrders);
}

main();
