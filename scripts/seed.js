require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'ESP32 4WD Wi-Fi & Bluetooth Smart Robot Car Kit',
    description: 'Build a wireless four-wheel-drive robot using an ESP32 board and L298N motor driver. The kit is designed for learning embedded programming, robotics and IoT control.',
    imageUrl: 'https://neevcraft.com/uploads/1788711582_Esp32002.jpeg',
    price: 2499,
    compareAtPrice: 3498.6,
    stock: 10,
    category: 'RoboDrive ESP32 Smart Car',
    features: [
      'ESP32 board with Wi-Fi and Bluetooth connectivity',
      'Four-wheel drive with TT motors and rubber wheels',
      'L298N dual H-bridge motor driver',
      'Programmable with Arduino IDE, MicroPython or ESP-IDF',
      'Wiring schematic and example code are listed as included',
    ],
    boxContents: [
      'ESP32 development board',
      'L298N motor driver and four TT motors',
      'Four wheels, chassis plates and battery holder',
      'Switch, jumper wires and mounting hardware',
    ],
  },
  {
    name: 'Arduino Bluetooth Controlled 2WD Smart Robot Car Kit',
    description: 'A hands-on Arduino robotics kit for building a smartphone-controlled two-wheel-drive car and learning motor control, Bluetooth communication and embedded programming.',
    imageUrl: 'https://neevcraft.com/uploads/1788712764_product_1c19428b6a0a.png',
    price: 1500,
    compareAtPrice: 2100,
    stock: 10,
    category: 'RoboDrive Arduino Smart Car',
    features: [
      'Arduino Uno R3 and L298N motor driver',
      'Bluetooth module for smartphone direction control',
      'Two BO gear motors, rubber wheels and a front caster',
      'Expandable with obstacle-avoidance or line-tracking sensors',
      'Wiring schematic and example code are listed as included',
    ],
    boxContents: [
      'Arduino Uno R3 with USB cable',
      'L298N motor driver and Bluetooth module',
      'Two BO motors, two wheels and caster wheel',
      'Wooden chassis, battery holder, jumper wires and hardware',
    ],
  },
  {
    name: 'Arduino Bluetooth Controlled 4WD Smart Robot Car Kit',
    description: 'A four-wheel-drive robotics platform with Arduino and Bluetooth smartphone control. A practical base for learning embedded systems and extending a robot with additional sensors.',
    imageUrl: 'https://neevcraft.com/uploads/1788712917_product_6830d8562d9c.png',
    price: 2499,
    compareAtPrice: 3248.7,
    stock: 10,
    category: 'RoboDrive Arduino Smart Car',
    features: [
      'Arduino Uno R3 and L298N dual H-bridge driver',
      'HC-05 Bluetooth module for smartphone control',
      'Four BO motors with high-grip rubber wheels',
      'Expandable with ultrasonic sensors, IR tracking or a servo mount',
      'Wiring schematic and example code are listed as included',
    ],
    boxContents: [
      'Arduino Uno R3 with USB cable',
      'L298N motor driver and HC-05 Bluetooth module',
      'Four motors and wheels with wooden chassis',
      'Battery holder, switch, jumper wires and mounting hardware',
    ],
  },
  {
    name: 'Arduino Uno SMD Board with USB Cable',
    description: 'An Arduino-compatible ATmega328P SMD development board for electronics, embedded systems and robotics projects, supplied with a USB programming cable.',
    imageUrl: 'https://neevcraft.com/uploads/1788713059_product_6fb45ab0bb4d.png',
    price: 349,
    compareAtPrice: 436.25,
    stock: 20,
    category: 'Boards',
    features: [
      'ATmega328P SMD microcontroller with CH340 USB interface',
      '14 digital I/O pins, including 6 PWM outputs',
      'Six analog inputs and 16 MHz clock',
      'Arduino IDE compatible; supports USB and external power',
    ],
    boxContents: ['Arduino Uno R3 SMD board', 'USB programming cable', 'Male pin header strip'],
  },
  {
    name: 'Waste-to-Electricity Generator Working Model Kit',
    description: 'A science-fair demonstration model illustrating energy conversion and emissions filtration concepts. It is an educational display kit, not a household power generator; demonstrations require responsible adult supervision.',
    imageUrl: 'https://neevcraft.com/uploads/1788713327_product_004ad84f116a.png',
    price: 5999,
    compareAtPrice: 8398.6,
    stock: 5,
    category: 'STEM Learning Kits',
    features: [
      'Demonstrates energy conversion and filtration concepts',
      'Includes a display panel with LED indicators and controls',
      'Designed for supervised science-fair and classroom demonstrations',
      'Wiring schematic and example code are listed as included',
    ],
    boxContents: [
      'Demonstration base and model assembly',
      'Filter tank, water pump, tubing and reservoir',
      'LED display, control panel and wiring',
      'Mounting hardware and decorative model pieces',
    ],
  },
  {
    name: '4WD Arduino Line Follower Robot Car Kit',
    description: 'Build an autonomous four-wheel-drive robot that follows a track using dual infrared sensors, an Arduino Uno and an L298N motor driver.',
    imageUrl: 'https://neevcraft.com/uploads/1788714498_product_11da240262a9.png',
    price: 2699,
    compareAtPrice: 3643.65,
    stock: 8,
    category: 'STEM Learning Kits',
    features: [
      'Dual IR tracking sensors for line-following experiments',
      'Arduino Uno R3 and L298N motor driver',
      'Four geared motors, rubber wheels and wooden chassis',
      'Expandable with obstacle sensors or Bluetooth control',
      'Wiring schematic and example code are listed as included',
    ],
    boxContents: [
      'Arduino Uno R3 with USB cable',
      'L298N driver and two IR line-tracking sensors',
      'Four motors, wheels and chassis',
      'Battery holder, jumper wires and mechanical hardware',
    ],
  },
  {
    name: 'Automatic Touchless Water Tap Working Model Kit',
    description: 'A hands-on automation model that demonstrates touchless water dispensing with an infrared sensor, relay and pump. Designed for STEM learning and supervised classroom demonstrations.',
    imageUrl: 'https://neevcraft.com/uploads/1788716242_product_9315b856cfc4.jpeg',
    price: 1700,
    compareAtPrice: 2380,
    stock: 8,
    category: 'Arduino Project',
    features: [
      'IR proximity sensor triggers a relay-controlled pump',
      'Demonstrates automation and water-conservation concepts',
      'Solderless assembly with a compact display structure',
      'Wiring schematic and example code are listed as included',
    ],
    boxContents: [
      'Mounting base and PVC tap stand',
      'IR sensor, 5V relay module and mini water pump',
      'Tubing, distribution rail, battery holder and jumper wires',
    ],
  },
  {
    name: 'NC-TWS01 True Wireless Earbuds with Type-C Charging',
    description: 'Compact true wireless earbuds with a charging case, ergonomic ear tips, an HD microphone and Type-C charging for everyday Bluetooth listening.',
    imageUrl: 'https://neevcraft.com/uploads/1791811290_product_b266283568a4.png',
    price: 699,
    compareAtPrice: 1188.3,
    stock: 12,
    category: 'Earbuds',
    features: [
      'True wireless Bluetooth earbuds',
      'Compact charging case with Type-C charging',
      'HD microphone and ergonomic ear tips',
      'Compatible with common Bluetooth-enabled phones, tablets and laptops',
    ],
    boxContents: ['Pair of earbuds', 'Charging case'],
  },
];

const seed = async () => {
  await connectDB();
  for (const product of products) {
    await Product.updateOne({ name: product.name }, { $setOnInsert: product }, { upsert: true });
  }
  console.log(`Seeded ${products.length} NeevCraft catalogue products. Seed stock is for demonstration; verify availability before launch.`);

  const adminFields = ['ADMIN_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
  const provided = adminFields.filter((field) => process.env[field]);
  if (provided.length > 0 && provided.length !== adminFields.length) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD together to seed an admin.');
  }
  if (provided.length === adminFields.length) {
    if (process.env.ADMIN_PASSWORD.length < 8) throw new Error('ADMIN_PASSWORD must contain at least 8 characters.');
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const existing = await User.findOne({ email });
    if (existing && existing.role !== 'admin') {
      throw new Error('That email already belongs to a customer; choose a different ADMIN_EMAIL.');
    }
    if (!existing) {
      await User.create({ name: process.env.ADMIN_NAME.trim(), email, password: process.env.ADMIN_PASSWORD, role: 'admin' });
      console.log(`Created admin account: ${email}`);
    } else {
      console.log(`Admin account already exists: ${email}`);
    }
  } else {
    console.log('No admin account requested. Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env to create one.');
  }
};

seed()
  .catch((error) => {
    console.error(`Seeding failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
