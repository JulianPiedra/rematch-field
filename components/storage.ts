import { Player, SavedPlay } from "./types"

const STORAGE_KEY = "tactical-plays"
const PLAYER_PREFERENCES_KEY = "player-preferences"

export interface PlayerPreference {
  id: Player["id"]
  name?: Player["name"]
  visible?: Player["visible"]
}

function isSavedPlay(play: unknown): play is SavedPlay {
  if (!play || typeof play !== "object") {
    return false
  }

  const candidate = play as Partial<SavedPlay>
  return typeof candidate.id === "string" && typeof candidate.name === "string" && Array.isArray(candidate.frames)
}

export const StorageService = {
  loadPlays(): SavedPlay[] {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY)
      const parsed = storedValue ? JSON.parse(storedValue) : null

      if (Array.isArray(parsed)) {
        const plays = parsed.filter(isSavedPlay)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plays))
        return plays
      }

      return []
    } catch (error) {
      console.log("Error loading plays:", error)
      return []
    }
  },

  savePlays(plays: SavedPlay[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plays))
      return true
    } catch (error) {
      console.error("Error saving plays:", error)
      return false
    }
  },

  loadPlayerPreferences(): PlayerPreference[] {
    try {
      const storedValue = localStorage.getItem(PLAYER_PREFERENCES_KEY)
      const parsed = storedValue ? JSON.parse(storedValue) : null

      if (!Array.isArray(parsed)) {
        return []
      }

      return parsed.filter(
        (preference): preference is PlayerPreference =>
          !!preference && typeof preference === "object" && typeof preference.id === "string",
      )
    } catch (error) {
      console.error("Error loading player preferences:", error)
      return []
    }
  },

  savePlayerPreferences(preferences: PlayerPreference[]): boolean {
    try {
      localStorage.setItem(PLAYER_PREFERENCES_KEY, JSON.stringify(preferences))
      return true
    } catch (error) {
      console.error("Error saving player preferences:", error)
      return false
    }
  },
}
