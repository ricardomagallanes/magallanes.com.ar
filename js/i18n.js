const translations = {
    es: {
        nav: {
            home: "Inicio",
            specs: "Ficha Técnica",
            innov: "Innovación",
            docs: "Documentación",
            contact: "Contacto"
        },
        hero: {
            title: "MAGALLANES",
            subtitle: "MOTORES DE AVIACIÓN",
            desc: "Propulsión aeronáutica de próxima generación. Potencia, seguridad y diseño modular para el mercado global.",
            cta: "Ver Especificaciones"
        },
        innov: {
            title: "Innovación y Desarrollo",
            c1_title: "Arquitectura Modular",
            c1_desc: "Diseño innovador que mejora la potencia y duración, garantizando máxima seguridad en vuelo.",
            c2_title: "Calidad Certificada",
            c2_desc: "Componentes de proveedores líderes y mano de obra altamente calificada.",
            c3_title: "Seguridad Operacional",
            c3_desc: "Doble encendido con magneto aeronáutico y bujía doble. Cumplimiento de normas internacionales."
        },
        specs: {
            title: "Ficha Técnica TM-2600",
            cylinders: "Cilindros",
            disp: "Cilindrada",
            config: "Configuración",
            cooling: "Enfriamiento",
            carb: "Carburador",
            val_cyl: "6",
            val_disp: "2600 cc (162 in³)",
            val_config: "Boxer DOHC",
            val_cooling: "Aire (Aircooled)",
            val_carb: "Marvel Schebler de Aspiración Natural",
            prop_shaft: "Árbol Portahélice",
            val_prop_shaft: "Con Reductor",
            flange: "Platina de Hélice",
            val_flange: "SAE2 Estándar",
            ignition: "Encendido",
            val_ignition: "Doble",
            spark: "Sistema Eléctrico",
            val_spark: "Magneto y Bujías Aeronáuticas",
            sump: "Lubricación",
            val_sump: "Carter Seco",
            prop_config: "Hélice",
            val_prop_config: "Tractor o Pusher",
            reg: "Marco Regulatorio",
            val_reg: "FAR 33"
        },
        docs: {
            title: "Documentación Técnica",
            desc: "Explore el detalle completo de las capacidades de nuestros motores.",
            download: "Descargar PDF"
        },
        gallery: {
            title: "Galería"
        },
        contact: {
            title: "Contacto",
            desc: "¿Interesado en nuestros motores? Contáctenos para más información sobre disponibilidad y pedidos.",
            email: "contacto@magallanes.com.ar",
            phone: "+54 351 8812226",
            social_title: "Seguinos en nuestras redes"
        }
    },
    en: {
        nav: {
            home: "Home",
            specs: "Tech Specs",
            innov: "Innovation",
            docs: "Documentation",
            contact: "Contact"
        },
        hero: {
            title: "MAGALLANES",
            subtitle: "AVIATION ENGINES",
            desc: "Next-generation aeronautical propulsion. Power, safety, and modular design for the global market.",
            cta: "View Specifications"
        },
        innov: {
            title: "Innovation & Development",
            c1_title: "Modular Architecture",
            c1_desc: "Innovative design that enhances power and durability, ensuring maximum flight safety.",
            c2_title: "Certified Quality",
            c2_desc: "Components from leading suppliers and highly qualified craftsmanship.",
            c3_title: "Operational Safety",
            c3_desc: "Dual ignition with aviation magneto and twin spark plugs. Compliance with international standards."
        },
        specs: {
            title: "Tech Specs TM-2600",
            cylinders: "Cylinders",
            disp: "Displacement",
            config: "Configuration",
            cooling: "Cooling",
            carb: "Carburetor",
            val_cyl: "6",
            val_disp: "2600 cc (162 in³)",
            val_config: "Boxer DOHC",
            val_cooling: "Aircooled",
            val_carb: "Marvel Schebler Natural Aspiration",
            prop_shaft: "Propeller Shaft",
            val_prop_shaft: "With Reducer",
            flange: "Propeller Flange",
            val_flange: "SAE2 Standard",
            ignition: "Ignition",
            val_ignition: "Dual",
            spark: "Electrical System",
            val_spark: "Magneto & Aviation Plugs",
            sump: "Lubrication",
            val_sump: "Dry Sump",
            prop_config: "Propeller Config",
            val_prop_config: "Tractor or Pusher",
            reg: "Regulatory Framework",
            val_reg: "FAR 33"
        },
        docs: {
            title: "Technical Documentation",
            desc: "Explore the full details of our engines' capabilities.",
            download: "Download PDF"
        },
        gallery: {
            title: "Gallery"
        },
        contact: {
            title: "Contact",
            desc: "Interested in our engines? Contact us for more information on availability and orders.",
            email: "contacto@magallanes.com.ar",
            phone: "+54 351 8812226",
            social_title: "Follow us on social media"
        }
    }
};

let currentLang = 'es';

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let val = translations[lang];
        keys.forEach(k => val = val[k]);
        if (val) el.textContent = val;
    });

    // Toggle Active State
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Event Listeners for Lang Utils
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // Set initial
    setLanguage('es');
});
