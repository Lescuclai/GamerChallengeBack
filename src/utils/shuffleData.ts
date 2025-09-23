export const shuffleData = <T>(data: T[], count: number): T[] => {
  const shuffle = [...data]
  for (let index = shuffle.length - 1; index > 0; index--) {
    const j: number = Math.floor(Math.random() * (index + 1))
    ;[shuffle[index], shuffle[j]] = [shuffle[j], shuffle[index]]
  }
  return shuffle.slice(0, count)
}
