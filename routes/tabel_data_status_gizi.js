const express = require("express");
const router = express.Router();
const { db } = require("../utils/connections");

// BB/U LAKI-LAKI
router.get("/get_berat_badan_umur_laki_laki", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(bb/u laki-laki)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// TB/U LAKI-LAKI
router.get("/get_tinggi_badan_umur_laki_laki", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(tb/u laki-laki)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// BB/PB LAKI-LAKI
router.get("/get_berat_badan_panjang_badan_laki_laki", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(bb/pb laki-laki)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// BB/TB LAKI-LAKI
router.get("/get_berat_badan_tinggi_badan_laki_laki", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(bb/tb laki-laki)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// IMT/U LAKI-LAKI
router.get("/get_imt_umur_laki_laki", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(imt/u laki-laki)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// IMT/U 5-18 thn LAKI-LAKI
router.get("/get_imt_umur_5_18_laki_laki", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(imt/u 5-18 thn laki-laki)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

//=========================================
// BB/U PEREMPUAN
router.get("/get_berat_badan_umur_perempuan", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(bb/u perempuan)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// TB/U PEREMPUAN
router.get("/get_tinggi_badan_umur_perempuan", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(tb/u perempuan)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// BB/PB PEREMPUAN
router.get("/get_berat_badan_panjang_badan_perempuan", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(bb/pb perempuan)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// BB/TB PEREMPUAN
router.get("/get_berat_badan_tinggi_badan_perempuan", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(bb/tb perempuan)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// IMT/U PEREMPUAN
router.get("/get_imt_umur_perempuan", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(imt/u perempuan)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// IMT/U 5-18 thn PEREMPUAN
router.get("/get_imt_umur_5_18_perempuan", async (req, res) => {
  try {
    const query = "SELECT * FROM `tb_(imt/u 5-18 thn perempuan)`";
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
