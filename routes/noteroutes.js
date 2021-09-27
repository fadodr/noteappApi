const express = require('express')
const router = express.Router()
const notecontroller = require('../controller/notecontroller')
const isauthenticated = require('../middleware/isauthenticated')

router.get('/', isauthenticated, notecontroller.getall_notes)
router.post('/', isauthenticated, notecontroller.create_note)
router.get('/:id', isauthenticated, notecontroller.getsingle_note)
router.put('/:id', isauthenticated, notecontroller.update_note)
router.delete('/:id', isauthenticated, notecontroller.delete_note)

module.exports = router;