// Scheduled function runs every 5 minutes
// Note: To deploy on a schedule, you can set this up via "firebase deploy"
// and then configure the schedule using `firebase functions:trigger` or from the console.
exports.collectAndStoreOHLC = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    try {
      const { start, end } = getTimeWindow();
      const swaps = await fetchSwaps(start, end);
      const ohlc = aggregateOHLC(swaps, start, end);
      await storeOHLC(ohlc);
      console.log(`Stored OHLC for interval ${start} - ${end}`);
    } catch (error) {
      console.error("Error collecting/storing OHLC:", error);
    }
  });