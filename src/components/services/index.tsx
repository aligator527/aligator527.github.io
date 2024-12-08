import { useState } from "react";

export default function ServicesPanel() {
    // Mapping of items to their descriptions
    const descriptions: {
        "IT Development": string;
        "DX & Automation": string;
        "Cloud Infrastructure": string;
        "Internationalization": string;
    } = {
        "IT Development": "We offer comprehensive IT development services tailored to meet the diverse needs of businesses, from local restaurants to large-scale industrial plants. Our expertise includes creating high-quality websites (HP and LP), SaaS applications, and mobile apps designed to enhance user experience and operational efficiency. We also specialize in developing CRM systems and management platforms to streamline workflows and improve customer relationships. Whether your business requires a bespoke solution or scalable software, our team leverages the latest technologies to deliver secure, reliable, and user-friendly products. Partner with us to transform your business ideas into cutting-edge digital solutions that drive growth and innovation.",
        "DX & Automation": "Our Digital Transformation (DX) and automation services are designed to modernize and optimize your business processes. We help digitize workflows, enhance customer experiences through innovative digital tools, and implement DevOps practices to ensure smooth software delivery and collaboration. Our DX consulting services provide strategic guidance to enable your organization to adapt to the rapidly evolving digital landscape. By automating repetitive tasks and integrating intelligent solutions, we empower businesses to increase efficiency, reduce costs, and focus on core competencies. Let us guide you on the path to a smarter, more agile, and future-ready business.",
        "Cloud Infrastructure": "Harness the power of the cloud with our robust cloud infrastructure services. We help businesses design, implement, and manage scalable, secure, and efficient cloud environments tailored to their unique requirements. From migration to optimization, our solutions ensure your IT infrastructure is reliable and ready for peak performance. Our team is skilled in deploying cutting-edge technologies to build systems that are cost-effective, resilient, and easy to manage. By embracing cloud solutions, you gain access to unparalleled flexibility and the ability to innovate faster, making your business more competitive in the digital era.",
        "Internationalization": "Expand your horizons with our comprehensive internationalization services. We specialize in developing multilingual applications and providing strategic consulting to support your business’s global expansion. From creating culturally adaptive solutions to assisting with foreign employee hiring and integration, we help businesses thrive in diverse environments. Our expertise includes building systems that accommodate different languages, cultures, and legal requirements, ensuring your global operations run smoothly. With our support, you can confidently enter new markets, connect with international audiences, and build a sustainable global presence.",
    };

    const [hoveredItem, setHoveredItem] = useState<keyof typeof descriptions | "">("IT Development");

    return (
        <section className="relative my-20 py-20 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex">
                {/* Left panel with list items */}
                <div className="w-2/5">
                    <h2 className="text-xl font-bold text-[#59705b] tracking-tight">
                        We can do these things
                    </h2>
                    <div className="mt-10">
                        <ul className="space-y-6 text-4xl text-slate-300">
                            {Object.keys(descriptions).map((item) => (
                                <li key={item}>
                                    <span
                                        className={`cursor-pointer ease-in duration-700 ${
                                            item === hoveredItem ? "text-[#59705b]" : "text-slate-300"
                                        }`}
                                        onMouseEnter={() => setHoveredItem(item as keyof typeof descriptions)}
                                        onClick={() => setHoveredItem(item as keyof typeof descriptions)}
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right panel with description */}
                <div
                    key={hoveredItem} // Ensure new render on hoveredItem change
                    className="mt-8 text-lg text-gray-700 animate-fade-in"
                >
                    <p>
                        {hoveredItem
                            ? descriptions[hoveredItem] // Use hoveredItem as key
                            : "Hover over an item to see details"}
                    </p>
                </div>
            </div>
        </section>
    );
}
