const router = require('express').Router();
const validator = require('../validators/ItemValidator');

let Item = require('../models/Item');

router.get('/', async (req, res) => {
    const filter = req.query.filter;
    let items;
    try {
        if(!filter) {
            items = await Item.find().exec();
        } else {
            items = await Item.find({name: { $regex : filter, $options : "i"}}).exec();
        }
    }catch(err) {
        res.status(404).send(err);
    }

    res.json(items);
});

router.post('/add', async (req, res) => {
    if(!validator.nameValidator(req.body.name)){
        res.status(406).send('Item name is not valid!');
    }
    if(!validator.descriptionValidator(req.body.description)){
        res.status(406).send('Item description is not valid!');
    }
    if(!validator.imgUrlValidator(req.body.imageUrl)){
        res.status(406).send('Item imageUrl is not valid!');
    }

    const itemFromDb = await Item.findOne({name : req.body.name}).exec();
    if(itemFromDb) {
        console.log('exists');
        return res.status(400).send('Item already exists!');
    }

    const item = new Item({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    });
    
    try {
        const saveItem = await item.save();
        res.json(saveItem._id);
    }catch(err) {
        console.log('Couldn\'t save!');
       return res.status(400).send(err);
    }
})

module.exports = router;