const express = require('express')
const router = express.Router()
const { getBackpack, addTab, deleteTab } = require('../controllers/tabsController')

const verifyToken = require('../middleware/verifyToken')


router.get('/backpack', verifyToken, getBackpack)
router.post('/tabs', verifyToken, addTab)
router.delete('/tabs/:id', verifyToken, deleteTab)

module.exports = router