var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const crypto = require('crypto');
const Unite7200 = require('../models/unite7200')
const Unite7300 = require('../models/unite7300')
const Unite7980 = require('../models/unite7980')
const Unite7500 = require('../models/unite7500')
const Unite7700 = require('../models/unite7700')
const tks = require('../models/tks')


const secretKey = process.env.JWT_SECRET_KEY || 'mysecretkey';

router.post('/signup', async (req, res) => {
  const { fname, lname, number, unite, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    fname,
    lname,
    number,
    unite,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
////////////////////////////////// LOGIN ////////////////////////////////////
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await mongoose.connection.collection('users').findOne({ email });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});
/////////////////////////////////////////////////////////////////
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
function calculatePostIndex(hour) {
  if (hour >= 6 && hour < 14) {
    return 1;
  } else if (hour >= 14 && hour < 22) {
    return 2;
  } else {
    return 3;
  }
}
///////////////////////////////// UNITE 7200 /////////////////////////////////
router.post('/submit-values7200', verifyToken, async (req, res) => {
  try {
    const {
      phOsmosée,
      cOsmosée,
      phReosmosée,
      cReosmosée,
      phDéminée,
      cDéminée
    } = req.body;
    const userId = req.userId;

    const validationErrors = [];

    if (!isValidpHValue(phOsmosée)) {
      validationErrors.push('phOsmosée');
    }

    if (!isValidpHValue(phReosmosée)) {
      validationErrors.push('phReosmosée');
    }

    if (!isValidpHValue(phDéminée)) {
      validationErrors.push('phDéminée');
    }

    if (!isValidcValue(cOsmosée)) {
      validationErrors.push('cOsmosée');
    }

    if (!isValidcValue(cReosmosée)) {
      validationErrors.push('cReosmosée');
    }

    if (!isValidcValue(cDéminée)) {
      validationErrors.push('cDéminée');
    }

    // if (validationErrors.length > 0) {
    //   return res.status(400).json({
    //     message: 'Values to review: ' + validationErrors.join(', ')
    //   });
    // }
    const currentHour = new Date().getHours();
    const postIndex = calculatePostIndex(currentHour);
    const unite7200 = new Unite7200({
      userID: userId,
      phOsmosée,
      cOsmosée,
      phReosmosée,
      cReosmosée,
      phDéminée,
      cDéminée,
      submissionTime: new Date(),
      postIndex
    });

    await unite7200.save();

    res.status(201).json({ message: 'Values submitted successfully.Values to review: ' + validationErrors.join(', ') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});
function isValidpHValue(value) {
  return typeof value === 'number' && value >= 6 && value <= 8;
}

function isValidcValue(value) {
  return typeof value === 'number' && value > 40;
}
//////////////////////////// tjibelna les valeurs te3 unite7200 associés lel utilisateur ///////////
router.get('/user-values7200', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const userValues = await Unite7200.find({ userID: userId });

    res.status(200).json(userValues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});
//////////////////////////////// tjib kol 
router.get('/all-values-7200', async (req, res) => {
  try {
        const allValues = await Unite7200.find();

    res.status(200).json(allValues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});
////////////////////////////// UNITE 7300 ////////////////////////
router.post('/submit-values-7300', verifyToken, async (req, res) => {
  try {
    const {
      ph,
      c,
      poste,
      echantillon
    } = req.body;
    const currentHour = new Date().getHours();
    const postIndex = calculatePostIndex(currentHour);

    const unite7300 = new Unite7300({
      ph,
      c,
      poste,
      echantillon,
      submissionTime: new Date(),
      postIndex
    });

    await unite7300.save();

    res.status(201).json({ message: 'Values submitted successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

//besh nsauvgardou les données fil base
router.post('/submit-values-7200', verifyToken, async (req, res) => {
  try {
    const {
      ph,
      c,
      poste,
      echantillon
    } = req.body;
    const currentHour = new Date().getHours();
    const postIndex = calculatePostIndex(currentHour);

    const unite7200 = new Unite7200({
      ph,
      c,
      poste,
      echantillon,
      submissionTime: new Date(),
      postIndex
    });

    await unite7200.save();

    res.status(201).json({ message: 'Values submitted successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

function isValidphAuxValue(value) {
  return typeof value === 'number' && value >= 9 && value <= 11;
}

function isValidphAlimentaireValue(value) {
  return typeof value === 'number' && value >= 8 && value <= 9;
}

function isValidphCondensatValue(value) {
  return typeof value === 'number' && value > 7;
}
//////////////////////////// UNITE 7980 //////////////////////
router.post('/submit-ph-7980', verifyToken, async (req, res) => {
  try {
    const { ph } = req.body;
    const userId = req.userId;
    if (!isValidpHValue(ph)) {
      return res.status(400).json({ message: 'Invalid pH value.' });
    }

    const currentHour = new Date().getHours();
    const postIndex = calculatePostIndex(currentHour);
    const unite7980 = new Unite7980({
      ph,
      submissionTime: new Date(),
      postIndex
    });

    await unite7980.save();

    res.status(201).json({ message: 'pH value submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

function isValidpHValue(value) {
  return typeof value === 'number';
}
////////////////////////////// UNITE 7500 ////////////////////
router.post('/submit-values-7500', verifyToken, async (req, res) => {
  try {
    const {
    userID,
    ph,
    poste,
    acidete,
    catégorie,
    heure,
    soufre,
      
    } = req.body;

    const validationMessages = [];

   /* if (!isValidphChaudiere(phChaudiere)) {
      validationMessages.push('phChaudiere should be between 9 and 11');
    }

    if (!isValidphValues(ph51, ph52, ph53, ph55)) {
      validationMessages.push('ph51, ph52, ph53, and ph55 should be between 8.5 and 9');
    }

    if (!isValidAciditedValues(acidited021, acidited022)) {
      validationMessages.push('acidited021 and acidited022 should be between 98 and 98.5');
    }

    if (!isValidFacteurCorrection(facteurCorrection)) {
      validationMessages.push('facteurCorrection should be less than 0.98');
    }

    if (!isValidCValues(co05cendre, do01cendre, do02cendre)) {
      validationMessages.push('co05cendre, do01cendre, and do02cendre should be more than 500');
    }

    if (!isValidCValues(co05bitume, do01bitume, do02bitume)) {
      validationMessages.push('co05bitume, do01bitume, and do02bitume should be more than 500');
    }

    if (!isValidCValues(co05acide, do01acide, do02acide)) {
      validationMessages.push('co05acide, do01acide, and do02acide should be more than 500');
    }

    if (!isValidFiloValues(filo01cendre, filo02cendre)) {
      validationMessages.push('filo01cendre and filo02cendre should be more than 20');
    }

    if (!isValidFiloValues(filo01bitume, filo02bitume)) {
      validationMessages.push('filo01bitume and filo02bitume should be more than 20');
    }

    if (!isValidFiloValues(filo01acide, filo02acide)) {
      validationMessages.push('filo01acide and filo02acide should be more than 20');
    }*/

    const unite7500 = new Unite7500({
      userID: req.userId,
  
    ph,
    poste,
    acidete,
    catégorie,
    heure,
    soufre,
      postIndex: calculatePostIndex(submissionTime.getHours())
    });

    await unite7500.save();

    const responseMessage =
      validationMessages.length === 0
        ? 'Values submitted successfully.'
        : 'Values submitted with validation issues. Review the following: ' + validationMessages.join(', ');

    res.status(201).json({ message: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

  /////////////7600////////////////////
  router.post('/submit-values-7600', verifyToken, async (req, res) => {
    try {
      const {
     
        P2O5,
          type,
          CaO,
          humidite,
          densite,
          T,
          tauxdesolide,
          H2SO4,
          MS,
          FilterA,
          FilterB,
          FilterC,
          FilterD,
          lavable,
          Syncristallise,
          Intaque,
          attaque,
          Filtration,
          chimique,
      } = req.body;
  
      const validationMessages = [];
  

      const unite7500 = new Unite7600({
        P2O5,
        type,
        CaO,
        humidite,
        densite,
        T,
        tauxdesolide,
        H2SO4,
        MS,
        FilterA,
        FilterB,
        FilterC,
        FilterD,
        lavable,
        Syncristallise,
        Intaque,
        attaque,
        Filtration,
        chimique,
        postIndex: calculatePostIndex(submissionTime.getHours())
      });
  
      await unite7600.save();
  
      const responseMessage =
        validationMessages.length === 0
          ? 'Values submitted successfully.'
          : 'Values submitted with validation issues. Review the following: ' + validationMessages.join(', ');
  
      res.status(201).json({ message: responseMessage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred.' });
    }

 
  }
  )
    
/////////////////7700////////////////
router.post('/submit-values-7700', verifyToken, async (req, res) => {
  try {
    const {
   
      P2O5,
        densite,
        ph,
       
    } = req.body;

    const validationMessages = [];
    const unite7700 = new Unite7700({
      P2O5,
      densite,
      ph,
      postIndex: calculatePostIndex(submissionTime.getHours())
    });

    await unite7700.save();

    const responseMessage =
      validationMessages.length === 0
        ? 'Values submitted successfully.'
        : 'Values submitted with validation issues. Review the following: ' + validationMessages.join(', ');

   
        res.status(201).json({ message: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }









  




});


module.exports = router;
