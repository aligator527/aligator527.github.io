export default function RepresentativeMessage() {
    return (
        <section className="relative my-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-balance text-5xl font-semibold tracking-tight lg:w-3/4 sm:text-7xl">
                    <span className="text-[#59705b]">Wanya Group's</span> Representative Message
                </h2>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex my-10">
                {/* Left panel with Image */}
                <div className="">
                    <img 
                        src="/images/representative.jpg"
                        className="h-96"
                        alt="Ivan Dolgov"
                    />
                    <div className="mt-3 font-light text-sm">
                        Ivan Dolgov, Representative
                    </div>
                </div>

                {/* Right panel with description */}
                <div
                    className="lg:w-3/5 text-lg font-light mt-8 lg:mt-0 lg:ms-10 border rounded border-gray-500 p-5"
                >
                    <p>
                        From the moment I started programming, when I was 12 years old, I already fully understood how IT is crucial for society's development. In an always-changing world, businesses need to face new challenges. My mission is to provide services to meet the demands of the new age.
                        <br className="mb-5" />
                        Through innovative system development and digital transformation strategies, I aim to help companies optimize their operations and enhance customer experiences. Whether it's creating cutting-edge applications, digitalizing processes, or supporting international expansion, my work is driven by the goal of empowering businesses to thrive in a connected, competitive world.
                    </p>
                </div>
            </div>
        </section>
    )
}