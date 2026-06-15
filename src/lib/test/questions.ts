import type {
  ScaleOption,
  Subarea,
  SimpleBlock,
  SpecifierQuestion,
} from "./types";

// --- Escalas reutilizables ---------------------------------------------------

/** Escala 0–3 para los criterios A y B (frecuencia / intensidad). */
export const SCALE_AB: ScaleOption[] = [
  { value: 0, label: "No ocurre o casi nunca ocurre" },
  { value: 1, label: "Ocurre de forma leve u ocasional" },
  { value: 2, label: "Ocurre con frecuencia y genera dificultad observable" },
  { value: 3, label: "Ocurre de forma intensa o afecta claramente la vida diaria" },
];

/** Escala 0–3 para el criterio D (impacto funcional). */
export const SCALE_D: ScaleOption[] = [
  { value: 0, label: "No afecta" },
  { value: 1, label: "Afecta poco o solo en situaciones específicas" },
  { value: 2, label: "Afecta con frecuencia o causa dificultades claras" },
  { value: 3, label: "Afecta mucho, limita significativamente o requiere apoyo frecuente" },
];

/** Escala 0–2 para el criterio C (inicio temprano). */
export const SCALE_C: ScaleOption[] = [
  { value: 0, label: "No / no hay evidencia desde la infancia" },
  { value: 1, label: "No estoy seguro / la información es parcial" },
  { value: 2, label: "Sí / hay evidencia clara desde la infancia" },
];

/** Escala 0–2 para el criterio E (alertas diferenciales). */
export const SCALE_E: ScaleOption[] = [
  { value: 0, label: "No" },
  { value: 1, label: "No estoy seguro" },
  { value: 2, label: "Sí" },
];

// Helper: construye preguntas con id correlativo a partir de un prefijo y escala.
function build(prefix: string, scale: ScaleOption[], texts: string[]) {
  return texts.map((text, i) => ({
    id: `${prefix}-${i + 1}`,
    text,
    options: scale,
  }));
}

// --- Criterio A: Comunicación e interacción social (18 preguntas) -------------

export const SUBAREAS: Subarea[] = [
  {
    id: "A1",
    block: "A",
    title: "Reciprocidad socioemocional",
    description:
      "Capacidad de iniciar, responder y mantener intercambios sociales de forma recíproca.",
    questions: build("A1", SCALE_AB, [
      "¿A la persona le cuesta iniciar conversaciones o acercarse a otros de manera natural?",
      "¿Tiene dificultad para mantener una conversación de ida y vuelta, donde ambos participan y responden al otro?",
      "¿Suele hablar principalmente de sus propios temas sin notar si la otra persona está interesada, aburrida o incómoda?",
      "¿Le cuesta compartir espontáneamente emociones, intereses, logros o experiencias con otras personas?",
      "¿Tiene dificultad para responder cuando otra persona intenta hablarle, jugar con ella, acercarse o compartir algo?",
      "¿Le cuesta reconocer o responder adecuadamente a las emociones de los demás, como tristeza, alegría, molestia o preocupación?",
    ]),
  },
  {
    id: "A2",
    block: "A",
    title: "Comunicación no verbal",
    description:
      "Uso y comprensión de gestos, mirada, expresiones faciales, postura y tono social.",
    questions: build("A2", SCALE_AB, [
      "¿La persona tiene un contacto visual poco habitual, como mirar muy poco, mirar demasiado fijo o evitar la mirada en situaciones sociales?",
      "¿Le cuesta acompañar lo que dice con gestos, expresiones faciales o movimientos corporales adecuados?",
      "¿Sus expresiones faciales parecen limitadas, poco claras o no coinciden con lo que está diciendo o sintiendo?",
      "¿Tiene dificultad para entender gestos de otras personas, como señalar, saludar, negar con la cabeza o indicar algo con la mirada?",
      "¿Le cuesta interpretar el lenguaje corporal de los demás, como notar si alguien está incómodo, apurado, molesto o interesado?",
      "¿Tiene dificultad para entender el tono de voz, la intención o las señales sociales no verbales de otras personas?",
    ]),
  },
  {
    id: "A3",
    block: "A",
    title: "Desarrollo y comprensión de relaciones",
    description:
      "Hacer y mantener amistades, adaptarse a contextos sociales y comprender normas sociales.",
    questions: build("A3", SCALE_AB, [
      "¿La persona tiene dificultad para hacer amigos o acercarse a otros de su edad?",
      "¿Le cuesta mantener amistades o relaciones sociales a lo largo del tiempo?",
      "¿Tiene dificultad para adaptar su comportamiento según el lugar o la situación, por ejemplo, en casa, escuela, trabajo, reuniones o lugares públicos?",
      "¿Le cuesta participar en juegos compartidos, actividades grupales o situaciones donde debe turnarse, cooperar o imaginar con otros?",
      "¿Parece tener poco interés en relacionarse con otras personas o prefiere estar sola la mayor parte del tiempo?",
      "¿Tiene dificultad para comprender normas sociales no dichas, como cuándo hablar, cuándo esperar, cómo saludar, cómo despedirse o qué temas son adecuados?",
    ]),
  },

  // --- Criterio B: Patrones restrictivos, repetitivos y sensoriales (20) -----
  {
    id: "B1",
    block: "B",
    title: "Conductas y movimientos repetitivos",
    description:
      "Movimientos corporales repetitivos, uso repetitivo de objetos o repeticiones en el lenguaje.",
    questions: build("B1", SCALE_AB, [
      "¿La persona realiza movimientos repetitivos con el cuerpo, como balancearse, mover las manos, girar, brincar, aletear o hacer movimientos similares una y otra vez?",
      "¿Suele usar objetos de forma repetitiva, por ejemplo alinearlos, girarlos, abrirlos y cerrarlos, ordenarlos de cierta manera o manipularlos siempre igual?",
      "¿Repite palabras, frases, sonidos, diálogos, preguntas o expresiones que escuchó de otras personas, televisión, videos o juegos?",
      "¿Tiende a repetir las mismas acciones, juegos o secuencias de comportamiento de forma constante, aunque otras personas intenten cambiar la actividad?",
      "¿Le cuesta detener o cambiar una conducta repetitiva cuando se le pide, incluso si la situación requiere hacer otra cosa?",
    ]),
  },
  {
    id: "B2",
    block: "B",
    title: "Rigidez y resistencia al cambio",
    description:
      "Dificultad para aceptar cambios, necesidad de seguir rutinas y patrones rígidos de comportamiento.",
    questions: build("B2", SCALE_AB, [
      "¿La persona se altera, se angustia o se molesta mucho cuando cambian sus planes, rutinas, caminos, horarios o actividades?",
      "¿Tiene dificultad para pasar de una actividad a otra, incluso cuando se le avisa con anticipación?",
      "¿Necesita hacer ciertas cosas siempre de la misma manera, en el mismo orden o siguiendo reglas propias muy específicas?",
      "¿Se frustra o se desorganiza cuando algo no sale como esperaba o cuando otra persona cambia la forma en que se hace una actividad?",
      "¿Muestra pensamientos o comportamientos muy rígidos, como insistir en que solo hay una forma correcta de hacer las cosas?",
    ]),
  },
  {
    id: "B3",
    block: "B",
    title: "Intereses restringidos",
    description:
      "Intereses muy intensos, limitados, repetitivos o difíciles de cambiar.",
    questions: build("B3", SCALE_AB, [
      "¿La persona tiene uno o pocos temas de interés que ocupan gran parte de su tiempo, conversación o pensamiento?",
      "¿Habla mucho sobre un mismo tema aunque los demás no estén interesados o intenten cambiar la conversación?",
      "¿Se molesta o incomoda cuando no puede hablar, investigar, jugar o hacer actividades relacionadas con su interés principal?",
      "¿Tiene un apego muy fuerte a objetos, temas, personajes, datos, colecciones o actividades específicas?",
      "¿Sus intereses parecen más intensos, absorbentes o repetitivos que los esperados para su edad o contexto?",
    ]),
  },
  {
    id: "B4",
    block: "B",
    title: "Sensibilidad sensorial",
    description:
      "Reacciones inusuales ante sonidos, luces, texturas, olores, sabores, dolor o temperatura.",
    questions: build("B4", SCALE_AB, [
      "¿La persona reacciona con molestia intensa ante sonidos, luces, olores, sabores, texturas de ropa, etiquetas, alimentos o contacto físico?",
      "¿Parece tener una reacción muy baja ante ciertos estímulos, como dolor, frío, calor, golpes o incomodidad física?",
      "¿Busca estímulos sensoriales de forma repetida, como tocar objetos, oler cosas, mirar luces, girar, balancearse o acercarse mucho a ciertos sonidos o movimientos?",
      "¿Tiene dificultades importantes con algunos alimentos por su textura, olor, color, temperatura o forma de presentación?",
      "¿Los estímulos sensoriales del ambiente pueden provocarle irritabilidad, angustia, bloqueo, crisis, evitación o necesidad de escapar de la situación?",
    ]),
  },
];

// --- Mini-bloques C, D, E ----------------------------------------------------

export const SIMPLE_BLOCKS: SimpleBlock[] = [
  {
    id: "C",
    title: "Inicio temprano",
    description:
      "Evalúa si estas características estaban presentes desde la infancia o etapas tempranas del desarrollo.",
    questions: build("C", SCALE_C, [
      "¿Estas dificultades sociales, comunicativas, repetitivas, de rigidez o sensoriales estaban presentes desde la infancia?",
      "¿Familiares, cuidadores, maestros u otras personas notaban desde pequeño/a que la persona se relacionaba, jugaba, hablaba o reaccionaba de forma diferente?",
      "¿Durante la infancia hubo señales como dificultad para hacer amigos, poco juego compartido, poca expresión social, intereses muy intensos, rigidez o sensibilidad sensorial?",
      "¿Estas características se hicieron más evidentes cuando aumentaron las exigencias sociales, escolares, familiares o laborales?",
      "¿La persona ha aprendido con el tiempo a ocultar, imitar, controlar o compensar estas dificultades para adaptarse mejor a los demás?",
    ]),
  },
  {
    id: "D",
    title: "Impacto funcional",
    description:
      "Evalúa si estas características afectan de manera significativa la vida diaria de la persona.",
    questions: build("D", SCALE_D, [
      "¿Estas características afectan las relaciones familiares, la convivencia en casa o la comunicación con personas cercanas?",
      "¿Estas características afectan la capacidad para hacer amistades, mantener relaciones o participar en actividades sociales?",
      "¿Estas características afectan el desempeño escolar, universitario, laboral o en actividades de aprendizaje?",
      "¿Estas características dificultan la autonomía diaria, la organización personal, la planificación o el manejo de responsabilidades?",
      "¿Estas características generan angustia, frustración, crisis, aislamiento, conflictos o malestar emocional frecuente?",
      "¿La persona necesita apoyo de otros para manejar situaciones sociales, cambios de rutina, sobrecarga sensorial o actividades cotidianas?",
    ]),
  },
  {
    id: "E",
    title: "Alertas y diagnóstico diferencial",
    description:
      "No suma puntos de autismo: detecta información que podría requerir evaluación profesional adicional o explicaciones alternativas.",
    questions: build("E", SCALE_E, [
      "¿La persona tiene diagnóstico previo o sospecha de discapacidad intelectual?",
      "¿La persona tiene diagnóstico previo o sospecha de retraso global del desarrollo?",
      "¿La persona tiene o tuvo retraso importante del lenguaje, pérdida del lenguaje o dificultad marcada para comunicarse verbalmente?",
      "¿La persona tiene diagnóstico previo o sospecha de TDAH, trastorno del lenguaje, trastorno de aprendizaje u otra condición del neurodesarrollo?",
      "¿La persona tiene diagnóstico previo o sospecha de ansiedad, depresión, trauma, trastorno obsesivo-compulsivo u otra condición emocional o conductual?",
      "¿Las dificultades aparecieron principalmente después de un evento específico, enfermedad, accidente, trauma, pérdida o cambio importante?",
      "¿Existen problemas auditivos, visuales, neurológicos, médicos o del sueño que podrían influir en la comunicación, la conducta o la interacción social?",
      "¿La persona ha sido evaluada previamente por psicología, psiquiatría, neurología, neuropediatría, terapia de lenguaje o neuropsicología?",
    ]),
  },
];

// --- Especificadores clínicos complementarios (sin puntaje) ------------------

export const SPECIFIERS: SpecifierQuestion[] = [
  {
    id: "S1",
    text: "¿La persona tiene diagnóstico confirmado de discapacidad intelectual?",
    options: [
      { value: "no", label: "No" },
      { value: "si", label: "Sí" },
      { value: "no_seguro", label: "No estoy seguro" },
    ],
  },
  {
    id: "S2",
    text: "¿La persona tiene dificultades importantes en el lenguaje verbal?",
    options: [
      { value: "no", label: "No" },
      { value: "leves", label: "Sí, leves" },
      { value: "moderadas", label: "Sí, moderadas" },
      { value: "severas", label: "Sí, severas" },
      { value: "sin_lenguaje", label: "No utiliza lenguaje verbal" },
      { value: "no_seguro", label: "No estoy seguro" },
    ],
  },
  {
    id: "S3",
    text: "¿La persona tiene alguna condición médica, genética o neurológica conocida?",
    options: [
      { value: "no", label: "No" },
      { value: "si", label: "Sí", requiresDetail: true },
      { value: "no_seguro", label: "No estoy seguro" },
    ],
  },
  {
    id: "S4",
    text: "¿La persona tiene otro diagnóstico psicológico, psiquiátrico, neurológico, conductual o del neurodesarrollo?",
    options: [
      { value: "no", label: "No" },
      { value: "si", label: "Sí", requiresDetail: true },
      { value: "no_seguro", label: "No estoy seguro" },
    ],
  },
  {
    id: "S5",
    text: "¿La persona presenta episodios en los que queda inmóvil, con posturas extrañas, muy rígida, con muy poca respuesta al entorno o con cambios motores llamativos?",
    note: "Esta pregunta no genera diagnóstico. Una respuesta afirmativa solo sugiere evaluación profesional.",
    options: [
      { value: "no", label: "No" },
      { value: "si", label: "Sí" },
      { value: "no_seguro", label: "No estoy seguro" },
    ],
  },
  {
    id: "S6",
    text: "¿La persona recibe actualmente terapia, tratamiento psicológico, psiquiátrico, neurológico, terapia ocupacional, terapia de lenguaje o apoyo educativo?",
    options: [
      { value: "no", label: "No" },
      { value: "si", label: "Sí", requiresDetail: true },
      { value: "no_seguro", label: "No estoy seguro" },
    ],
  },
];

/** Texto del campo de detalle por especificador (cuando requiresDetail). */
export const SPECIFIER_DETAIL_LABEL: Record<string, string> = {
  S3: "¿Cuál?",
  S4: "¿Cuál?",
  S6: "¿Qué tipo de apoyo recibe?",
};

/** Disclaimer obligatorio (antes y después del test). */
export const DISCLAIMER =
  "Esta herramienta es únicamente orientativa. No sustituye una evaluación psicológica, " +
  "médica, psiquiátrica, neurológica o neuropsicológica. Un puntaje alto no confirma autismo " +
  "y un puntaje bajo no lo descarta por completo. Si los resultados generan preocupación o " +
  "existen dificultades importantes en la vida diaria, se recomienda acudir a un profesional especializado.";
