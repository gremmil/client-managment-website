const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccount.json');

// Inicializar Firebase Admin usando la nueva sintaxis
initializeApp({
  credential: cert(serviceAccount)
});

// Obtener la instancia de la base de datos
const db = getFirestore();

// 100 Nombres variados (Masculinos y Femeninos)
const names = [
  'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Diana', 'Pedro', 'Laura', 'Jorge', 'Sofía',
  'Andrés', 'Gabriela', 'Diego', 'Lucía', 'Mateo', 'Valentina', 'Santiago', 'Isabella', 'Sebastián', 'Camila',
  'Alejandro', 'Valeria', 'Daniel', 'Mariana', 'David', 'Natalia', 'Javier', 'Elena', 'Manuel', 'Paula',
  'Fernando', 'Patricia', 'Francisco', 'Beatriz', 'Ricardo', 'Carmen', 'José', 'Rosa', 'Miguel', 'Teresa',
  'Antonio', 'Isabel', 'Alberto', 'Raquel', 'Roberto', 'Sonia', 'Eduardo', 'Alicia', 'Hugo', 'Irene',
  'Iván', 'Julia', 'Kevin', 'Lorena', 'Lucas', 'Marta', 'Marcos', 'Mónica', 'Nicolás', 'Olga',
  'Oscar', 'Pilar', 'Ramón', 'Sara', 'Tomás', 'Victoria', 'Víctor', 'Silvia', 'Rafael', 'Ángela',
  'Héctor', 'Cristina', 'César', 'Celia', 'Adrián', 'Clara', 'Arturo', 'Emilia', 'Enrique', 'Estela',
  'Felipe', 'Flora', 'Gerardo', 'Inés', 'Jaime', 'Juana', 'Leonardo', 'Lola', 'Mario', 'Nora',
  'Pablo', 'Regina', 'Salvador', 'Yolanda', 'Samuel', 'Adriana', 'Claudio', 'Gloria', 'Mauricio', 'Esther'
];

// 100 Apellidos variados
const lastnames = [
  'Pérez', 'Gómez', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'González', 'Díaz', 'Fernández', 'Torres',
  'Romero', 'Ruiz', 'Álvarez', 'Vargas', 'Castillo', 'Jiménez', 'Moreno', 'Ríos', 'Herrera', 'Medina',
  'Muñoz', 'Ortega', 'Castro', 'Ortiz', 'Ramos', 'Delgado', 'Salazar', 'Guerrero', 'Paredes', 'Cruz',
  'Flores', 'Morales', 'Reyes', 'Gutiérrez', 'Aguilar', 'Mendoza', 'Solís', 'Miranda', 'Fuentes', 'Acosta',
  'Silva', 'Cabrera', 'Benítez', 'Bravo', 'Vega', 'Soto', 'Duarte', 'Rivas', 'Peña', 'Navarro',
  'Serrano', 'Domínguez', 'Vázquez', 'Méndez', 'Rojas', 'Núñez', 'Luna', 'Maldonado', 'Valenzuela', 'Pizarro',
  'Gallardo', 'Figueroa', 'Tapia', 'Arancibia', 'Cáceres', 'Carrasco', 'Espinosa', 'Henríquez', 'Lara', 'Olivares',
  'Orellana', 'Pinto', 'Saavedra', 'Sepúlveda', 'Vergara', 'Zamora', 'Zúñiga', 'Beltrán', 'Calvo', 'Cordero',
  'Durán', 'Esquivel', 'Galarza', 'Hurtado', 'Ibarra', 'Jáuregui', 'Lozano', 'Montenegro', 'Ochoa', 'Palacios',
  'Quevedo', 'Robles', 'Salgado', 'Trejo', 'Uribe', 'Vela', 'Yáñez', 'Molina', 'Mera', 'Campos'
];

// --- CAMBIO AQUÍ: Reducido a 500 registros para optimizar desarrollo local ---
const TOTAL_RECORDS = 500; 
const BATCH_LIMIT = 500; // Límite de Firestore por lote

async function generateMassiveClients() {
  const clientsRef = db.collection('clients'); // Nombre de la colección en Firestore
  let currentBatch = db.batch();
  let operationCounter = 0;
  let batchesSent = 0;

  console.log(`Starting the creation of ${TOTAL_RECORDS} records using 100x100 unique combinations...`);

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const lastname = lastnames[Math.floor(Math.random() * lastnames.length)];
    const age = Math.floor(Math.random() * (80 - 18 + 1)) + 18; // Edades entre 18 y 80 años

    // Generar fecha de nacimiento coherente con la edad (calculado respecto al año actual)
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'); // Evita problemas de días inexistentes
    const birthDate = `${birthYear}-${month}-${day}`; // Formato ISO String: YYYY-MM-DD

    // Referencia de documento con ID autogenerado por Firestore
    const newDocRef = clientsRef.doc();

    // Cargar la operación en el lote actual
    const now = new Date().toISOString();
    currentBatch.set(newDocRef, {
      name,
      lastname,
      age,
      birthDate,
      createdAt: now,
      updatedAt: now,
    });

    operationCounter++;

    // Si alcanzamos el límite de 500 escrituras, enviamos el lote y abrimos uno nuevo
    if (operationCounter === BATCH_LIMIT) {
      console.log(`Sending batch ${batchesSent + 1}...`);
      await currentBatch.commit();
      batchesSent++;
      
      // Reiniciar lote y contador
      currentBatch = db.batch();
      operationCounter = 0;
    }
  }

  // Enviar los últimos registros si quedaron fuera de un bloque exacto de 500
  if (operationCounter > 0) {
    console.log(`Sending last remaining batch with ${operationCounter} records...`);
    await currentBatch.commit();
    batchesSent++;
  }

  console.log(`\nSuccess! ${TOTAL_RECORDS} highly varied records have been created successfully.`);
  process.exit(0);
}

generateMassiveClients().catch((error) => {
  console.error("Error populating the database:", error);
  process.exit(1);
});