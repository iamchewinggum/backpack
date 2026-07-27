const { unpackBackpack, addToBackpack, removeTab, emptyBackpack } = require('../data')

const getBackpack = async (req, res) => {
  try {
    const tabs = await unpackBackpack(req.userId)
    res.json(tabs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch backpack' })
  }
}

const addTab = async (req, res) => {
  try {
    const { url, title } = req.body
    const newTab = await addToBackpack(url, title, req.userId)
    res.json({ message: 'Tab added to backpack', tab: newTab })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add tab' })
  }
}

const deleteTab = async (req, res) => {
  try {
    const tabId = parseInt(req.params.id)
    await removeTab(tabId, req.userId)
    res.json({ message: 'Tab removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to remove tab' })
  }
}

module.exports = { getBackpack, addTab, deleteTab }