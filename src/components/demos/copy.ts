type Lang = "pt-BR" | "en"

export type ScriptStep =
	| { t: "u" | "a"; x: string }
	| { t: "l"; x: [string, string]; n: number }

export interface Scenario {
	id: string
	label: string
	contact: string
	avatar: string
	nodes: string[]
	script: ScriptStep[]
}

export interface DemoHeadCopy {
	k: string
	t: string
	d: string
}

interface DemoCopy {
	demos: { path: string; title: string }
	chat: DemoHeadCopy & { online: string; input: string; flow: string; events: string }
	scenarios: Scenario[]
	build: DemoHeadCopy & { tree: string; done: string; compiling: string }
	term: DemoHeadCopy
}

export const DEMO_COPY: Record<Lang, DemoCopy> = {
	"pt-BR": {
		demos: { path: "demos", title: "O que eu construo, rodando ao vivo." },
		chat: {
			k: "automação.ia",
			t: "Atendimento com IA no WhatsApp",
			d: "O cliente manda mensagem, um agente entende a intenção, consulta os sistemas do negócio e responde em segundos, sem passar por um atendente.",
			online: "online · respondido por IA",
			input: "Mensagem",
			flow: "workflow.log",
			events: "eventos"
		},
		scenarios: [
			{
				id: "ecom",
				label: "E-commerce",
				contact: "Loja Raiz",
				avatar: "R",
				nodes: ["webhook", "agente IA", "shopify", "bling erp"],
				script: [
					{ t: "u", x: "Oi, comprei um tênis semana passada e ainda não chegou. Pedido #4821" },
					{ t: "l", x: ["whatsapp", "mensagem recebida"], n: 0 },
					{ t: "l", x: ["agente", "intenção → status do pedido"], n: 1 },
					{ t: "l", x: ["shopify", "#4821 · pago · enviado"], n: 2 },
					{ t: "l", x: ["bling", "NF-e 10293 · rastreio ok"], n: 3 },
					{ t: "a", x: "Oi, Lucas! Seu pedido saiu ontem e está em trânsito. Previsão de entrega: quinta-feira." },
					{ t: "u", x: "Ah, e dá pra trocar pelo 42? O 41 vai ficar apertado" },
					{ t: "l", x: ["agente", "intenção → troca de tamanho"], n: 1 },
					{ t: "l", x: ["shopify", "tam. 42 · 3 em estoque"], n: 2 },
					{ t: "a", x: "Dá sim! Reservei um 42 pra você. Quando o pedido chegar, é só usar a etiqueta de troca que te mandei por e-mail." },
					{ t: "l", x: ["bling", "troca registrada · etiqueta gerada"], n: 3 }
				]
			},
			{
				id: "clinic",
				label: "Clínica",
				contact: "Clínica Vitta",
				avatar: "V",
				nodes: ["webhook", "agente IA", "agenda", "crm"],
				script: [
					{ t: "u", x: "Boa tarde! Queria remarcar minha consulta de amanhã, surgiu um imprevisto" },
					{ t: "l", x: ["whatsapp", "mensagem recebida"], n: 0 },
					{ t: "l", x: ["agente", "intenção → remarcar consulta"], n: 1 },
					{ t: "l", x: ["crm", "paciente · Ana Souza"], n: 3 },
					{ t: "l", x: ["agenda", "3 horários livres"], n: 2 },
					{ t: "a", x: "Boa tarde, Ana! Sem problema. Tenho segunda às 9h, terça às 15h ou quarta às 11h com a Dra. Paula." },
					{ t: "u", x: "Terça às 15h" },
					{ t: "l", x: ["agenda", "ter 15:00 reservado"], n: 2 },
					{ t: "l", x: ["crm", "consulta remarcada"], n: 3 },
					{ t: "a", x: "Feito! Terça, 15h, com a Dra. Paula. O horário de amanhã já foi liberado." }
				]
			},
			{
				id: "burger",
				label: "Restaurante",
				contact: "Cantina Brasa",
				avatar: "C",
				nodes: ["webhook", "agente IA", "cardápio", "pix"],
				script: [
					{ t: "u", x: "Quero 2 pratos executivos de frango e um suco de laranja, pra entrega" },
					{ t: "l", x: ["whatsapp", "mensagem recebida"], n: 0 },
					{ t: "l", x: ["agente", "intenção → novo pedido"], n: 1 },
					{ t: "l", x: ["cardápio", "3 itens · R$ 72,90"], n: 2 },
					{ t: "a", x: "Anotado! 2 Executivos de Frango + Suco de Laranja: R$ 72,90 com entrega. Confirma o endereço da última vez, Rua das Flores, 120?" },
					{ t: "u", x: "Isso, pode mandar" },
					{ t: "l", x: ["pix", "cobrança gerada"], n: 3 },
					{ t: "a", x: "Te mandei o Pix aqui embaixo. Assim que cair, o pedido vai pra cozinha. Entrega em uns 40 min." },
					{ t: "l", x: ["pix", "pagamento confirmado"], n: 3 },
					{ t: "l", x: ["cardápio", "pedido #312 → cozinha"], n: 2 }
				]
			},
			{
				id: "solar",
				label: "Vendas · Solar",
				contact: "Sol Forte Energia",
				avatar: "S",
				nodes: ["webhook", "agente IA", "simulador", "crm"],
				script: [
					{ t: "u", x: "Oi, vi o anúncio de vocês. Quanto custa colocar energia solar em casa?" },
					{ t: "l", x: ["whatsapp", "mensagem recebida"], n: 0 },
					{ t: "l", x: ["agente", "intenção → orçamento"], n: 1 },
					{ t: "a", x: "Oi! Pra te passar um valor certo: quanto vem sua conta de luz por mês, em média?" },
					{ t: "u", x: "Uns R$ 450" },
					{ t: "l", x: ["simulador", "~520 kWh/mês · 8 placas"], n: 2 },
					{ t: "a", x: "Pra esse consumo, um sistema de 8 placas resolve. Fica em torno de R$ 16 mil e a economia é de até 90% na conta. Quer agendar uma visita técnica gratuita?" },
					{ t: "u", x: "Quero sim, sábado de manhã dá?" },
					{ t: "l", x: ["crm", "lead qualificado · visita sáb 9h"], n: 3 },
					{ t: "a", x: "Agendado pra sábado às 9h. O técnico confirma com você na sexta." }
				]
			}
		],
		build: {
			k: "web.build",
			t: "Do esqueleto ao site no ar",
			d: "Estrutura primeiro, estilo depois. Componentes montados em ordem, com layout responsivo desde a primeira linha.",
			tree: "componentes",
			done: "build ok",
			compiling: "compilando…"
		},
		term: { k: "api.backend", t: "APIs que respondem rápido", d: "Endpoints tipados, cache e infraestrutura em containers." }
	},
	en: {
		demos: { path: "demos", title: "What I build, running live." },
		chat: {
			k: "ai.automation",
			t: "AI customer service on WhatsApp",
			d: "The customer sends a message, an agent understands the intent, checks the business systems and replies in seconds, without a human agent.",
			online: "online · answered by AI",
			input: "Message",
			flow: "workflow.log",
			events: "events"
		},
		scenarios: [
			{
				id: "ecom",
				label: "E-commerce",
				contact: "Raiz Store",
				avatar: "R",
				nodes: ["webhook", "AI agent", "shopify", "bling erp"],
				script: [
					{ t: "u", x: "Hi, I bought sneakers last week and they haven't arrived. Order #4821" },
					{ t: "l", x: ["whatsapp", "message received"], n: 0 },
					{ t: "l", x: ["agent", "intent → order status"], n: 1 },
					{ t: "l", x: ["shopify", "#4821 · paid · shipped"], n: 2 },
					{ t: "l", x: ["bling", "invoice 10293 · tracking ok"], n: 3 },
					{ t: "a", x: "Hi Lucas! Your order shipped yesterday and is in transit. Expected delivery: Thursday." },
					{ t: "u", x: "Oh, can I swap it for a size 42? The 41 will be tight" },
					{ t: "l", x: ["agent", "intent → size exchange"], n: 1 },
					{ t: "l", x: ["shopify", "size 42 · 3 in stock"], n: 2 },
					{ t: "a", x: "Sure! I've reserved a 42 for you. When the order arrives, just use the return label I sent to your email." },
					{ t: "l", x: ["bling", "exchange logged · label created"], n: 3 }
				]
			},
			{
				id: "clinic",
				label: "Clinic",
				contact: "Vitta Clinic",
				avatar: "V",
				nodes: ["webhook", "AI agent", "calendar", "crm"],
				script: [
					{ t: "u", x: "Good afternoon! I need to reschedule tomorrow's appointment, something came up" },
					{ t: "l", x: ["whatsapp", "message received"], n: 0 },
					{ t: "l", x: ["agent", "intent → reschedule"], n: 1 },
					{ t: "l", x: ["crm", "patient · Ana Souza"], n: 3 },
					{ t: "l", x: ["calendar", "3 open slots"], n: 2 },
					{ t: "a", x: "Good afternoon, Ana! No problem. I have Monday 9am, Tuesday 3pm or Wednesday 11am with Dr. Paula." },
					{ t: "u", x: "Tuesday at 3pm" },
					{ t: "l", x: ["calendar", "tue 15:00 booked"], n: 2 },
					{ t: "l", x: ["crm", "appointment rescheduled"], n: 3 },
					{ t: "a", x: "Done! Tuesday, 3pm, with Dr. Paula. Tomorrow's slot has been released." }
				]
			},
			{
				id: "burger",
				label: "Restaurant",
				contact: "Brasa Kitchen",
				avatar: "B",
				nodes: ["webhook", "AI agent", "menu", "pix"],
				script: [
					{ t: "u", x: "I'd like 2 chicken lunch specials and an orange juice, for delivery" },
					{ t: "l", x: ["whatsapp", "message received"], n: 0 },
					{ t: "l", x: ["agent", "intent → new order"], n: 1 },
					{ t: "l", x: ["menu", "3 items · R$ 72.90"], n: 2 },
					{ t: "a", x: "Got it! 2 Chicken Specials + Orange Juice: R$ 72.90 with delivery. Same address as last time, 120 Flores St?" },
					{ t: "u", x: "Yes, send it" },
					{ t: "l", x: ["pix", "payment request created"], n: 3 },
					{ t: "a", x: "I've sent the Pix below. As soon as it clears, your order goes to the kitchen. Delivery in about 40 min." },
					{ t: "l", x: ["pix", "payment confirmed"], n: 3 },
					{ t: "l", x: ["menu", "order #312 → kitchen"], n: 2 }
				]
			},
			{
				id: "solar",
				label: "Sales · Solar",
				contact: "Sol Forte Energy",
				avatar: "S",
				nodes: ["webhook", "AI agent", "simulator", "crm"],
				script: [
					{ t: "u", x: "Hi, I saw your ad. How much does it cost to install solar at home?" },
					{ t: "l", x: ["whatsapp", "message received"], n: 0 },
					{ t: "l", x: ["agent", "intent → quote"], n: 1 },
					{ t: "a", x: "Hi! To give you an accurate price: how much is your electricity bill per month, on average?" },
					{ t: "u", x: "About R$ 450" },
					{ t: "l", x: ["simulator", "~520 kWh/mo · 8 panels"], n: 2 },
					{ t: "a", x: "For that usage, an 8-panel system works. It's around R$ 16k and saves up to 90% on your bill. Want to book a free technical visit?" },
					{ t: "u", x: "Yes, does Saturday morning work?" },
					{ t: "l", x: ["crm", "qualified lead · visit sat 9am"], n: 3 },
					{ t: "a", x: "Booked for Saturday at 9am. The technician will confirm with you on Friday." }
				]
			}
		],
		build: {
			k: "web.build",
			t: "From skeleton to live site",
			d: "Structure first, style second. Components assembled in order, responsive from the first line.",
			tree: "components",
			done: "build ok",
			compiling: "compiling…"
		},
		term: { k: "api.backend", t: "APIs that answer fast", d: "Typed endpoints, caching and containerized infrastructure." }
	}
}

type Kpi = [string, string, string]
type Row = [string, string, string, number, string]
type StockItem = [string, string, boolean]

interface DashCopy {
	head: DemoHeadCopy
	views: [string, string][]
	url: Record<"admin" | "client", string>
	kpis: Kpi[]
	cols: string[]
	rows: Row[]
	risk: number[]
	stock: StockItem[]
	stockT: string
	ai: string
	q: string
	a: string
	act: string
	actDone: string
	ask: string
	hi: string
	order: string
	steps: [string, string][]
	update: string
	upd: string
	cq: string
	ca: string
}

export const DASH_COPY: Record<Lang, DashCopy> = {
	"pt-BR": {
		head: {
			k: "sistemas.ia",
			t: "Sistema de gestão com IA integrada",
			d: "Exemplo para uma fábrica de móveis planejados: o admin centraliza vendas, estoque e o andamento de cada obra, e consulta tudo em linguagem natural. O cliente acompanha a própria obra num portal."
		},
		views: [
			["admin", "Painel admin"],
			["client", "Portal do cliente"]
		],
		url: { admin: "gestao.moveisatelier.com.br", client: "minhaobra.moveisatelier.com.br" },
		kpis: [
			["vendas · out", "R$ 184 mil", "+12%"],
			["obras em produção", "14", "4 esta semana"],
			["estoque crítico", "3 itens", "abaixo do mínimo"]
		],
		cols: ["cliente", "ambiente", "etapa", "progresso", "prazo"],
		rows: [
			["Fernanda Lima", "Cozinha", "Montagem", 70, "18/10"],
			["Ricardo Alves", "Closet", "Corte", 35, "12/10"],
			["Juliana Prado", "Home office", "Instalação", 90, "09/10"],
			["Marcos Teixeira", "Dormitório", "Corte", 20, "15/10"]
		],
		risk: [1, 3],
		stock: [
			["MDF branco 18mm", "12 ch.", true],
			["Corrediça telescópica", "40 un.", false],
			["Puxador perfil", "18 un.", false]
		],
		stockT: "estoque",
		ai: "assistente",
		q: "Quais obras correm risco de atrasar?",
		a: "Duas. O closet do Ricardo está 3 dias atrasado no corte. O dormitório do Marcos depende de MDF branco 18mm, que está abaixo do mínimo.",
		act: "Gerar pedido de compra",
		actDone: "Pedido de compra #208 enviado ao fornecedor",
		ask: "Pergunte sobre vendas, estoque, obras…",
		hi: "Olá, Fernanda",
		order: "Cozinha planejada · pedido #1042",
		steps: [
			["Projeto aprovado", "22/09"],
			["Corte das peças", "30/09"],
			["Montagem na fábrica", "em andamento"],
			["Entrega", "previsão 16/10"],
			["Instalação", "previsão 18/10"]
		],
		update: "Última atualização",
		upd: "Portas e gavetas montadas. Próximo passo: acabamento e embalagem.",
		cq: "Que dia vão instalar minha cozinha?",
		ca: "A instalação está prevista para sábado, 18/10, a partir das 8h. Se algo mudar, te aviso por aqui e no WhatsApp."
	},
	en: {
		head: {
			k: "systems.ai",
			t: "Management system with built-in AI",
			d: "Example for a custom furniture workshop: the admin centralizes sales, inventory and the progress of each job, and queries everything in plain language. Clients follow their own job in a portal."
		},
		views: [
			["admin", "Admin dashboard"],
			["client", "Client portal"]
		],
		url: { admin: "admin.atelierfurniture.com", client: "myproject.atelierfurniture.com" },
		kpis: [
			["sales · oct", "R$ 184k", "+12%"],
			["jobs in production", "14", "4 this week"],
			["low stock", "3 items", "below minimum"]
		],
		cols: ["client", "room", "stage", "progress", "due"],
		rows: [
			["Fernanda Lima", "Kitchen", "Assembly", 70, "10/18"],
			["Ricardo Alves", "Closet", "Cutting", 35, "10/12"],
			["Juliana Prado", "Home office", "Installation", 90, "10/09"],
			["Marcos Teixeira", "Bedroom", "Cutting", 20, "10/15"]
		],
		risk: [1, 3],
		stock: [
			["White MDF 18mm", "12 sh.", true],
			["Telescopic slide", "40 pcs", false],
			["Profile handle", "18 pcs", false]
		],
		stockT: "inventory",
		ai: "assistant",
		q: "Which jobs are at risk of running late?",
		a: "Two. Ricardo's closet is 3 days behind in cutting. Marcos's bedroom depends on white MDF 18mm, which is below minimum stock.",
		act: "Create purchase order",
		actDone: "Purchase order #208 sent to supplier",
		ask: "Ask about sales, stock, jobs…",
		hi: "Hi, Fernanda",
		order: "Custom kitchen · order #1042",
		steps: [
			["Design approved", "09/22"],
			["Panel cutting", "09/30"],
			["Workshop assembly", "in progress"],
			["Delivery", "expected 10/16"],
			["Installation", "expected 10/18"]
		],
		update: "Latest update",
		upd: "Doors and drawers assembled. Next step: finishing and packing.",
		cq: "What day will my kitchen be installed?",
		ca: "Installation is scheduled for Saturday 10/18, from 8am. If anything changes, I'll let you know here and on WhatsApp."
	}
}

type TermLine = { c: true; x: string } | { c?: false; h: [string, string][] }

export const TERM_LINES: TermLine[] = [
	{ c: true, x: "curl -X POST api.loja.dev/v1/orders" },
	{ h: [["text-[#A3E635]", "201 Created"], ["text-[#7C8796]", " · 38ms"]] },
	{
		h: [
			["text-[#7C8796]", "{ "],
			["text-[#38BDF8]", '"id"'],
			["text-[#7C8796]", ": "],
			["text-[#A3E635]", '"ord_8f2k"'],
			["text-[#7C8796]", ", "],
			["text-[#38BDF8]", '"status"'],
			["text-[#7C8796]", ": "],
			["text-[#A3E635]", '"paid"'],
			["text-[#7C8796]", " }"]
		]
	},
	{ c: true, x: "docker compose ps" },
	{ h: [["text-[#7C8796]", "api    "], ["text-[#A3E635]", "running"], ["text-[#7C8796]", "  healthy"]] },
	{ h: [["text-[#7C8796]", "db     "], ["text-[#A3E635]", "running"], ["text-[#7C8796]", "  healthy"]] },
	{ h: [["text-[#7C8796]", "redis  "], ["text-[#A3E635]", "running"], ["text-[#7C8796]", "  healthy"]] },
	{ c: true, x: "npm run test" },
	{ h: [["text-[#A3E635]", "✓ 48 passed"], ["text-[#7C8796]", " · 0 failed · 2.1s"]] }
]
