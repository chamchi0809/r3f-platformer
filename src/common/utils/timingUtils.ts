export default class Timing {
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static async waitUntil(condition: () => boolean, checkInterval = 50): Promise<void> {
    while (!condition()) {
      await Timing.delay(checkInterval)
    }
  }

  static async waitWhile(condition: () => boolean, checkInterval = 50): Promise<void> {
    while (condition()) {
      await Timing.delay(checkInterval)
    }
  }
}
