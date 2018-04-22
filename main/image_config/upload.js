const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.memoryStorage(),
    fimits: {
        fileSizr: 5 * 1024 * 1024
    },
    fileFilter: function(req, file, cb) {
        // Check File Type
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Ckeck mine
        const mimetype = filetypes.test(file.mimetype);

        if(mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('image');

module.exports = upload;
