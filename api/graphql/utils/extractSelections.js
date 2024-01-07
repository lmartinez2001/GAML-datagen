const getSelections = (info) => {
  return info.fileNodes[0].selectionSet?.selections || null
}

const extractSelection = (info) => {
  const selections = getSelections(info)
  if (!selections) return []

  return selections.reduce((initialValue, selection) => {
    if (selection.kind === 'Field') {
      return [...initialValue, selection.name.value]
    }
    return initialValue
  }, [])
}
