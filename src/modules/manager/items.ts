import { Backpack, BookSearch, FileSpreadsheet, HandCoinsIcon, HardHat, PersonStanding, ShoppingBasket, SignpostBig, User2Icon, UserCog } from "lucide-react"

export const items = [
    {
        title: "Construtor de Aventureiro",
        url: "/construtor-aventureiro",
        icon: User2Icon,
        isBlocked: false,
    },
    {
        title: "Itens & Equipamentos",
        url: "/itens?category=arma",
        icon: ShoppingBasket,
        isBlocked: false,
    },
    {
        title: "Containers & Bagagens",
        url: "/containers",
        icon: Backpack,
        isBlocked: false,
    },
    {
        title: "Fichas",
        url: "https://ficha.gutods.com.br",
        icon: FileSpreadsheet,
        isBlocked: false,
    },
    {
        title: "Raças",
        url: "/racas",
        icon: PersonStanding,
        isBlocked: false,
    },
    {
        title: "Classes",
        url: "/classes",
        icon: SignpostBig,
        isBlocked: false,
    },
    {
        title: "Escudo do mestre",
        url: "/escudo-do-mestre",
        icon: BookSearch,
        isBlocked: false,
    },
    {
        title: "Gerador de Tesouro",
        url: "/tesouro",
        icon: HandCoinsIcon,
        isBlocked: false,
    },
    // {
    //     title: "Gerador de Aventureiro",
    //     url: "/gerador-aventureiro",
    //     icon: UserCog,
    //     color: "text-gray-400",
    //     isBlocked: true,
    // },
    // {
    //     title: "Feitiços",
    //     url: "/em-breve",
    //     icon: HardHat,
    //     color: "text-gray-400",
    //     isBlocked: true,
    // },
    // {
    //     title: "Monstros",
    //     url: "/monstros",
    //     icon: BookSearch,
    //     color: "text-gray-400",
    //     isBlocked: true,
    // },
    // {
    //     title: "Gerador de NPC",
    //     url: "/em-breve",
    //     icon: HardHat,
    //     color: "text-gray-400",
    //     isBlocked: true,
    // },
    // {
    //     title: "War machine",
    //     url: "/em-breve",
    //     icon: HardHat,
    //     color: "text-gray-400",
    //     isBlocked: true,
    // },
    {
        title: "Configurações",
        url: "/configuracoes",
        icon: UserCog,
        isBlocked: false,
    }
]