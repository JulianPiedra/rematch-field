import { SavedPlay } from "./types"

export const StorageService = {
  loadPlays(): SavedPlay[] {
    try {
      const stored: Record<string, SavedPlay> = {}
      let i = 0
      while (true) {
        const key = `tactical-play-${i}`
        const value = sessionStorage.getItem(key)
        if (!value) break
        stored[key] = JSON.parse(value)
        i++
      }
      return Object.values(stored)
    } catch (error) {
      console.log("Error loading plays:", error)
      return []
    }
  },

  savePlays(plays: SavedPlay[]): boolean {
    try {
      let i = 0
      while (sessionStorage.getItem(`tactical-play-${i}`)) {
        sessionStorage.removeItem(`tactical-play-${i}`)
        i++
      }

      plays.forEach((play, index) => {
        sessionStorage.setItem(`tactical-play-${index}`, JSON.stringify(play))
      })
      return true
    } catch (error) {
      console.error("Error saving plays:", error)
      return false
    }
  },
}
