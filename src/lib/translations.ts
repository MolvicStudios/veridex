export type Lang = 'es' | 'en';

export const translations = {
	es: {
		meta: {
			title: 'Prospectly — Verifica cualquier noticia con IA',
			description: 'Analiza la fiabilidad de noticias con inteligencia artificial. Detecta fake news, contenido generado por IA y sesgos editoriales.'
		},
		nav: { home: 'Inicio', privacy: 'Privacidad', cookies: 'Cookies', terms: 'Términos', by: 'por' },
		hero: {
			badge: 'Impulsado por IA',
			title: '¿Es real esta noticia?',
			subtitle: 'Analiza cualquier noticia con IA. Detectamos desinformación, contenido generado por IA y sesgos editoriales en segundos.',
			tabUrl: 'Por URL',
			tabText: 'Pegar texto',
			urlPlaceholder: 'https://ejemplo.com/noticia...',
			textPlaceholder: 'Pega aquí el texto completo de la noticia que quieres analizar...',
			analyzeBtn: 'Analizar noticia',
			analyzing: 'Analizando...',
			fetching: 'Obteniendo artículo...'
		},
		limits: {
			title: 'Límite diario alcanzado',
			message: 'Has usado tus 3 análisis gratuitos de hoy.',
			resetMsg: 'Se reinician a las 00:00.',
			remaining: (n: number) => n === 1 ? '1 análisis restante hoy' : `${n} análisis restantes hoy`,
			useOwnKey: 'Usa tu propia clave API para análisis ilimitados'
		},
		errors: {
			fetchError: 'No se pudo obtener el contenido de la URL. Prueba pegando el texto directamente.',
			analyzeError: 'Error al analizar. Por favor, inténtalo de nuevo.',
			emptyContent: 'Introduce una URL o pega el texto de la noticia.',
			invalidUrl: 'La URL no es válida.',
			tooShort: 'El texto es demasiado corto. Necesitamos al menos 100 caracteres.',
			invalidApiKey: 'La clave API no es válida o ha expirado.'
		},
		scores: {
			reliability_index: 'Índice de Fiabilidad',
			veracity: 'Veracidad',
			ai_generated: 'Generado por IA',
			sensationalism: 'Sensacionalismo',
			bias: 'Sesgo Editorial',
			emotional_manipulation: 'Manipulación Emocional',
			source_reputation: 'Reputación de la Fuente',
			authorship_transparency: 'Transparencia de Autoría',
			internal_coherence: 'Coherencia Interna',
			corroboration: 'Corroboración'
		},
		scoreDescriptions: {
			reliability_index: 'Puntuación global basada en todos los indicadores',
			veracity: 'Probabilidad de que los hechos sean verificables y precisos',
			ai_generated: 'Probabilidad de que el texto haya sido generado por IA',
			sensationalism: 'Uso de lenguaje alarmista o titular engañoso',
			bias: 'Tendencia política o ideológica del contenido',
			emotional_manipulation: 'Uso de lenguaje diseñado para provocar emociones fuertes',
			source_reputation: 'Historial de fiabilidad del medio o fuente',
			authorship_transparency: 'Identificación clara y verificable del autor',
			internal_coherence: 'Concordancia entre titular y contenido del artículo',
			corroboration: 'Fuentes independientes que confirman la información (0-5)'
		},
		verdicts: {
			verified: 'Verificada',
			questionable: 'Dudosa',
			possible_ai: 'Posible IA',
			disinformation: 'Desinformación',
			outdated: 'Desactualizada',
			clickbait: 'Clickbait'
		},
		verdictDescriptions: {
			verified: 'Alta fiabilidad, hechos contrastables con múltiples fuentes.',
			questionable: 'Información parcial, sin contrastar o con inconsistencias.',
			possible_ai: 'Alta probabilidad de haber sido generada por inteligencia artificial.',
			disinformation: 'Se han detectado datos falsos o deliberadamente engañosos.',
			outdated: 'Noticia antigua presentada como si fuera reciente.',
			clickbait: 'El titular es engañoso o exagerado respecto al contenido real.'
		},
		biasLabels: {
			'Far Left': 'Izquierda extrema', 'Left': 'Izquierda', 'Center-Left': 'Centro-izquierda',
			'Center': 'Centro', 'Center-Right': 'Centro-derecha', 'Right': 'Derecha', 'Far Right': 'Derecha extrema'
		},
		results: {
			summary: 'Resumen', keyClaims: 'Afirmaciones principales', redFlags: 'Señales de alarma',
			positiveSignals: 'Señales positivas', shareBtn: 'Compartir', shareCopied: '¡Enlace copiado!',
			newAnalysis: 'Nuevo análisis', analyzedAt: 'Analizado el', noRedFlags: 'Sin señales de alarma',
			noPositiveSignals: 'Sin señales positivas', unknown: 'Desconocida', sourceReputation: 'Fuente no identificada',
			corroborationOf: 'de 5 fuentes'
		},
		apiDrawer: {
			title: 'Tu clave API',
			subtitle: 'Usa tu propia clave para análisis ilimitados',
			unlimitedBadge: '∞ Ilimitado',
			provider: 'Proveedor',
			model: 'Modelo',
			apiKeyLabel: 'Clave API',
			apiKeyPlaceholder: 'gsk_... / sk-... / sk-or-...',
			showKey: 'Mostrar', hideKey: 'Ocultar',
			saveBtn: 'Guardar y activar',
			clearBtn: 'Borrar clave',
			savedMsg: '¡Clave guardada! Análisis ilimitados activados.',
			clearedMsg: 'Clave eliminada. De vuelta al plan gratuito.',
			howToGet: 'Cómo conseguir una clave gratuita',
			providers: {
				groq: {
					name: 'Groq', description: 'Muy rápido. Tier gratuito generoso.',
					url: 'https://console.groq.com', urlText: 'console.groq.com',
					steps: ['Crea cuenta en console.groq.com', 'Ve a "API Keys" → "Create API Key"', 'Copia y pega aquí']
				},
				mistral: {
					name: 'Mistral AI', description: 'Modelos europeos de alta calidad.',
					url: 'https://console.mistral.ai', urlText: 'console.mistral.ai',
					steps: ['Crea cuenta en console.mistral.ai', 'Ve a "API Keys" → "Create new key"', 'Copia y pega aquí']
				},
				openrouter: {
					name: 'OpenRouter', description: 'Acceso a cientos de modelos, muchos gratuitos.',
					url: 'https://openrouter.ai', urlText: 'openrouter.ai',
					steps: ['Crea cuenta en openrouter.ai', 'Ve a "Keys" → "Create Key"', 'Selecciona un modelo con ":free" al final', 'Copia y pega aquí']
				}
			},
			models: {
				groq: [
					{ id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Recomendado)' },
					{ id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Rápido)' },
					{ id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
					{ id: 'gemma2-9b-it', name: 'Gemma 2 9B' }
				],
				mistral: [
					{ id: 'mistral-small-latest', name: 'Mistral Small (Recomendado)' },
					{ id: 'mistral-large-latest', name: 'Mistral Large' },
					{ id: 'open-mistral-7b', name: 'Mistral 7B (Gratuito)' }
				],
				openrouter: [
					{ id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Gratuito)' },
					{ id: 'google/gemini-2.0-flash-lite:free', name: 'Gemini 2.0 Flash Lite (Gratuito)' },
					{ id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Gratuito)' },
					{ id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Gratuito)' }
				]
			}
		},
		news: {
			title: 'Noticias del momento',
			subtitle: '¿Son fiables? Verifícalas con IA',
			verifyBtn: 'Verificar',
			readMore: 'Leer más',
			loading: 'Cargando noticias...',
			error: 'No se pudieron cargar las noticias',
			noNews: 'Sin noticias disponibles',
			source: 'Fuente'
		},
		howItWorks: {
			title: 'Cómo funciona',
			steps: [
				{ title: 'Introduce la noticia', description: 'Pega la URL o el texto de cualquier noticia que quieras verificar.' },
				{ title: 'La IA la analiza', description: 'Nuestros modelos de IA examinan el contenido, las fuentes y el estilo del texto.' },
				{ title: 'Obtén el resultado', description: 'Recibe un informe detallado con puntuaciones y una recomendación clara.' }
			]
		},
		disclaimer: 'Prospectly es una herramienta de orientación. Los resultados son estimaciones basadas en IA y no constituyen una verificación periodística definitiva. Utiliza siempre el pensamiento crítico.',
		cookie: {
			message: 'Usamos cookies propias y de terceros (Google AdSense) para mejorar tu experiencia y mostrarte publicidad relevante.',
			accept: 'Aceptar todas', reject: 'Solo esenciales', learnMore: 'Más info'
		},
		footer: {
			tagline: 'Verificación de noticias con inteligencia artificial',
			links: 'Navegación', legal: 'Legal', rights: 'Todos los derechos reservados.'
		},
		privacy: {
			title: 'Política de Privacidad',
			lastUpdated: 'Última actualización: 12 de marzo de 2026',
			sections: [
				{ title: '1. Responsable del tratamiento', content: 'MolvicStudios.pro es el responsable del tratamiento de los datos. Contacto: molvicstudios@outlook.com' },
				{ title: '2. Datos que recopilamos', content: 'Prospectly no requiere registro ni recoge datos personales identificables. Los únicos datos procesados son el texto o URL que el usuario introduce voluntariamente para su análisis, los cuales son enviados a modelos de IA de terceros para generar el informe y no son almacenados en nuestros servidores.' },
				{ title: '3. Uso de cookies', content: 'Usamos cookies técnicas esenciales para el funcionamiento del sitio (preferencias de tema e idioma, contador de análisis diarios). Con tu consentimiento, también usamos cookies de terceros de Google AdSense para mostrar publicidad relevante. Consulta nuestra Política de Cookies para más detalle.' },
				{ title: '4. Servicios de terceros', content: 'Para el análisis de contenido usamos las APIs de Groq Inc., Mistral AI y OpenRouter. Para la publicidad usamos Google AdSense. Para la extracción de URLs usamos el servicio público Jina Reader. Cada uno tiene su propia política de privacidad.' },
				{ title: '5. Base legal del tratamiento', content: 'El tratamiento se basa en el interés legítimo del servicio (análisis solicitado por el usuario) y en el consentimiento explícito para las cookies no esenciales.' },
				{ title: '6. Transferencias internacionales', content: 'Los modelos de IA pueden procesar datos en servidores ubicados fuera del Espacio Económico Europeo. Estas transferencias están amparadas por cláusulas contractuales estándar.' },
				{ title: '7. Derechos del usuario', content: 'Tienes derecho a acceder, rectificar, suprimir y portabilidad de tus datos, así como a oponerte o limitar su tratamiento. Para ejercerlos, contacta con nosotros en molvicstudios@outlook.com' },
				{ title: '8. Cambios en esta política', content: 'Nos reservamos el derecho de modificar esta política. Los cambios se publicarán en esta página con la fecha de actualización.' }
			]
		},
		cookiesPage: {
			title: 'Política de Cookies',
			lastUpdated: 'Última actualización: 12 de marzo de 2026',
			intro: 'Esta política explica qué son las cookies, qué tipos usamos y cómo puedes gestionarlas.',
			sections: [
				{ title: '¿Qué son las cookies?', content: 'Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo para recordar preferencias y mejorar la experiencia de uso.' },
				{ title: 'Cookies esenciales', content: 'Estas cookies son necesarias para el funcionamiento del sitio: preferencia de tema (oscuro/claro), idioma y contador de análisis diarios. No pueden desactivarse.' },
				{ title: 'Cookies de publicidad (Google AdSense)', content: 'Con tu consentimiento, Google AdSense usa cookies para mostrarte anuncios relevantes basados en tus intereses. Puedes gestionar estas preferencias en Mi Cuenta de Google.' },
				{ title: 'Cómo gestionar las cookies', content: 'Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que algunas funcionalidades del sitio podrían verse afectadas. Para revocar tu consentimiento, borra las cookies del sitio.' }
			]
		},
		terms: {
			title: 'Términos de Uso',
			lastUpdated: 'Última actualización: 12 de marzo de 2026',
			sections: [
				{ title: '1. Aceptación de los términos', content: 'Al usar Prospectly aceptas estos términos de uso. Si no los aceptas, por favor no uses el servicio.' },
				{ title: '2. Descripción del servicio', content: 'Prospectly es una herramienta de análisis de noticias basada en inteligencia artificial. Los resultados son estimaciones y no garantías de veracidad o falsedad de ninguna noticia.' },
				{ title: '3. Limitación de responsabilidad', content: 'Prospectly y MolvicStudios.pro no son responsables de las decisiones tomadas basándose en los resultados del análisis. La herramienta es orientativa y complementaria al pensamiento crítico del usuario.' },
				{ title: '4. Uso aceptable', content: 'No está permitido usar Prospectly para: (a) automatizar solicitudes masivas, (b) intentar extraer datos del sistema, (c) usar el servicio con fines ilegales o para difundir desinformación.' },
				{ title: '5. Propiedad intelectual', content: 'El nombre Prospectly, el diseño y el código son propiedad de MolvicStudios.pro. Queda prohibida su reproducción sin autorización expresa.' },
				{ title: '6. Modificaciones', content: 'Nos reservamos el derecho de modificar el servicio o estos términos en cualquier momento. Los cambios serán comunicados en esta página.' }
			]
		}
	},
	en: {
		meta: {
			title: 'Prospectly — Verify any news with AI',
			description: 'Analyze news reliability with artificial intelligence. Detect fake news, AI-generated content and editorial bias.'
		},
		nav: { home: 'Home', privacy: 'Privacy', cookies: 'Cookies', terms: 'Terms', by: 'by' },
		hero: {
			badge: 'AI-powered',
			title: 'Is this news real?',
			subtitle: 'Analyze any news article with AI. We detect disinformation, AI-generated content and editorial bias in seconds.',
			tabUrl: 'By URL',
			tabText: 'Paste text',
			urlPlaceholder: 'https://example.com/article...',
			textPlaceholder: 'Paste the full text of the article you want to analyze...',
			analyzeBtn: 'Analyze article',
			analyzing: 'Analyzing...',
			fetching: 'Fetching article...'
		},
		limits: {
			title: 'Daily limit reached',
			message: "You've used your 3 free analyses for today.",
			resetMsg: 'Resets at midnight.',
			remaining: (n: number) => n === 1 ? '1 analysis remaining today' : `${n} analyses remaining today`,
			useOwnKey: 'Use your own API key for unlimited analyses'
		},
		errors: {
			fetchError: "Couldn't fetch the URL content. Try pasting the text directly.",
			analyzeError: 'Analysis failed. Please try again.',
			emptyContent: 'Enter a URL or paste the article text.',
			invalidUrl: 'The URL is not valid.',
			tooShort: 'Text is too short. We need at least 100 characters.',
			invalidApiKey: 'API key is invalid or expired.'
		},
		scores: {
			reliability_index: 'Reliability Index',
			veracity: 'Veracity',
			ai_generated: 'AI Generated',
			sensationalism: 'Sensationalism',
			bias: 'Editorial Bias',
			emotional_manipulation: 'Emotional Manipulation',
			source_reputation: 'Source Reputation',
			authorship_transparency: 'Authorship Transparency',
			internal_coherence: 'Internal Coherence',
			corroboration: 'Corroboration'
		},
		scoreDescriptions: {
			reliability_index: 'Overall score based on all indicators',
			veracity: 'Likelihood that the facts are verifiable and accurate',
			ai_generated: 'Probability that the text was generated by AI',
			sensationalism: 'Use of alarmist language or misleading headlines',
			bias: 'Political or ideological leaning of the content',
			emotional_manipulation: 'Use of language designed to provoke strong emotions',
			source_reputation: 'Track record of the outlet or source',
			authorship_transparency: 'Clear and verifiable identification of the author',
			internal_coherence: 'Alignment between headline and article body',
			corroboration: 'Independent sources confirming the information (0-5)'
		},
		verdicts: {
			verified: 'Verified',
			questionable: 'Questionable',
			possible_ai: 'Possible AI',
			disinformation: 'Disinformation',
			outdated: 'Outdated',
			clickbait: 'Clickbait'
		},
		verdictDescriptions: {
			verified: 'High reliability, facts backed by multiple independent sources.',
			questionable: 'Partial or unverified information with some inconsistencies.',
			possible_ai: 'High probability of having been generated by artificial intelligence.',
			disinformation: 'False or deliberately misleading data has been detected.',
			outdated: 'Old news presented as if it were recent.',
			clickbait: 'The headline is misleading or exaggerated compared to the actual content.'
		},
		biasLabels: {
			'Far Left': 'Far Left', 'Left': 'Left', 'Center-Left': 'Center-Left',
			'Center': 'Center', 'Center-Right': 'Center-Right', 'Right': 'Right', 'Far Right': 'Far Right'
		},
		results: {
			summary: 'Summary', keyClaims: 'Key claims', redFlags: 'Red flags',
			positiveSignals: 'Positive signals', shareBtn: 'Share', shareCopied: 'Link copied!',
			newAnalysis: 'New analysis', analyzedAt: 'Analyzed on', noRedFlags: 'No red flags detected',
			noPositiveSignals: 'No positive signals detected', unknown: 'Unknown',
			sourceReputation: 'Source not identified', corroborationOf: 'of 5 sources'
		},
		apiDrawer: {
			title: 'Your API Key',
			subtitle: 'Use your own key for unlimited analyses',
			unlimitedBadge: '∞ Unlimited',
			provider: 'Provider',
			model: 'Model',
			apiKeyLabel: 'API Key',
			apiKeyPlaceholder: 'gsk_... / sk-... / sk-or-...',
			showKey: 'Show', hideKey: 'Hide',
			saveBtn: 'Save & activate',
			clearBtn: 'Remove key',
			savedMsg: 'Key saved! Unlimited analyses activated.',
			clearedMsg: 'Key removed. Back to free plan.',
			howToGet: 'How to get a free API key',
			providers: {
				groq: {
					name: 'Groq', description: 'Very fast. Generous free tier.',
					url: 'https://console.groq.com', urlText: 'console.groq.com',
					steps: ['Create account at console.groq.com', 'Go to "API Keys" → "Create API Key"', 'Copy and paste here']
				},
				mistral: {
					name: 'Mistral AI', description: 'High-quality European models.',
					url: 'https://console.mistral.ai', urlText: 'console.mistral.ai',
					steps: ['Create account at console.mistral.ai', 'Go to "API Keys" → "Create new key"', 'Copy and paste here']
				},
				openrouter: {
					name: 'OpenRouter', description: 'Access to hundreds of models, many free.',
					url: 'https://openrouter.ai', urlText: 'openrouter.ai',
					steps: ['Create account at openrouter.ai', 'Go to "Keys" → "Create Key"', 'Select a model with ":free" suffix', 'Copy and paste here']
				}
			},
			models: {
				groq: [
					{ id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Recommended)' },
					{ id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Fast)' },
					{ id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
					{ id: 'gemma2-9b-it', name: 'Gemma 2 9B' }
				],
				mistral: [
					{ id: 'mistral-small-latest', name: 'Mistral Small (Recommended)' },
					{ id: 'mistral-large-latest', name: 'Mistral Large' },
					{ id: 'open-mistral-7b', name: 'Mistral 7B (Free)' }
				],
				openrouter: [
					{ id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)' },
					{ id: 'google/gemini-2.0-flash-lite:free', name: 'Gemini 2.0 Flash Lite (Free)' },
					{ id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)' },
					{ id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free)' }
				]
			}
		},
		news: {
			title: "Today's top news",
			subtitle: 'Are they reliable? Verify them with AI',
			verifyBtn: 'Verify',
			readMore: 'Read more',
			loading: 'Loading news...',
			error: 'Could not load news',
			noNews: 'No news available',
			source: 'Source'
		},
		howItWorks: {
			title: 'How it works',
			steps: [
				{ title: 'Enter the article', description: 'Paste the URL or text of any article you want to verify.' },
				{ title: 'AI analyzes it', description: 'Our AI models examine the content, sources and writing style.' },
				{ title: 'Get the result', description: 'Receive a detailed report with scores and a clear recommendation.' }
			]
		},
		disclaimer: 'Prospectly is a guidance tool. Results are AI-based estimates and do not constitute a definitive journalistic verification. Always use critical thinking.',
		cookie: {
			message: 'We use first- and third-party cookies (Google AdSense) to improve your experience and show relevant ads.',
			accept: 'Accept all', reject: 'Essential only', learnMore: 'Learn more'
		},
		footer: {
			tagline: 'AI-powered news verification',
			links: 'Navigation', legal: 'Legal', rights: 'All rights reserved.'
		},
		privacy: {
			title: 'Privacy Policy',
			lastUpdated: 'Last updated: March 12, 2026',
			sections: [
				{ title: '1. Data controller', content: 'MolvicStudios.pro is the data controller. Contact: molvicstudios@outlook.com' },
				{ title: '2. Data we collect', content: 'Prospectly does not require registration or collect personally identifiable data. The only data processed is the text or URL voluntarily submitted by the user for analysis, which is sent to third-party AI models to generate the report and is not stored on our servers.' },
				{ title: '3. Use of cookies', content: 'We use essential technical cookies for site functionality (theme preferences, language, daily analysis counter). With your consent, we also use third-party Google AdSense cookies to display relevant advertising. See our Cookie Policy for details.' },
				{ title: '4. Third-party services', content: 'For content analysis we use the APIs of Groq Inc., Mistral AI and OpenRouter. For advertising we use Google AdSense. For URL extraction we use the public Jina Reader service. Each has its own privacy policy.' },
				{ title: '5. Legal basis', content: 'Processing is based on the legitimate interest of the service (analysis requested by the user) and explicit consent for non-essential cookies.' },
				{ title: '6. International transfers', content: 'AI models may process data on servers located outside the European Economic Area. Such transfers are covered by standard contractual clauses.' },
				{ title: '7. Your rights', content: 'You have the right to access, rectify, erase and obtain portability of your data, as well as to object or restrict its processing. To exercise these rights contact us at molvicstudios@outlook.com' },
				{ title: '8. Changes', content: 'We reserve the right to modify this policy. Changes will be published on this page with the update date.' }
			]
		},
		cookiesPage: {
			title: 'Cookie Policy',
			lastUpdated: 'Last updated: March 12, 2026',
			intro: 'This policy explains what cookies are, which types we use and how you can manage them.',
			sections: [
				{ title: 'What are cookies?', content: 'Cookies are small text files stored on your device to remember preferences and improve the user experience.' },
				{ title: 'Essential cookies', content: 'These cookies are necessary for the site to work: theme preference (dark/light), language and daily analysis counter. They cannot be disabled.' },
				{ title: 'Advertising cookies (Google AdSense)', content: 'With your consent, Google AdSense uses cookies to show you relevant ads based on your interests. You can manage these preferences in your Google Account.' },
				{ title: 'How to manage cookies', content: 'You can configure your browser to block or delete cookies. Note that some site features may be affected. To revoke your consent, clear the site cookies.' }
			]
		},
		terms: {
			title: 'Terms of Use',
			lastUpdated: 'Last updated: March 12, 2026',
			sections: [
				{ title: '1. Acceptance of terms', content: 'By using Prospectly you accept these terms. If you do not agree, please do not use the service.' },
				{ title: '2. Service description', content: 'Prospectly is an AI-powered news analysis tool. Results are estimates and do not constitute guarantees of the veracity or falsity of any news article.' },
				{ title: '3. Limitation of liability', content: 'Prospectly and MolvicStudios.pro are not responsible for decisions made based on analysis results. The tool is advisory and complementary to the user\'s own critical thinking.' },
				{ title: '4. Acceptable use', content: 'It is not permitted to use Prospectly to: (a) automate bulk requests, (b) attempt to extract system data, (c) use the service for illegal purposes or to spread disinformation.' },
				{ title: '5. Intellectual property', content: 'The Prospectly name, design and code are the property of MolvicStudios.pro. Reproduction without express authorization is prohibited.' },
				{ title: '6. Modifications', content: 'We reserve the right to modify the service or these terms at any time. Changes will be communicated on this page.' }
			]
		}
	}
} as const;

export type Translations = typeof translations;

export function getT(lang: Lang) {
	return translations[lang] as unknown as typeof translations['es'];
}
