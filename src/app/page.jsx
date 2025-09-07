import FeaturesSection from "@/components/features";
import Herosection from "@/components/hero";
import PricingSection from "@/components/pricing";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const stat = [
    {label : "Images Generated", value: "10,000" , suffix:"+" },
    {label : "Active Users", value: "500" , suffix:"+" },
    {label : "AI Transformations ", value: "150" , suffix:"+"}, 
    {label : "User Satisfaction", value: "5" , suffix:"%" } ,
  ]

  return (
   <div className="pt-36 " >
     <Herosection></Herosection>
      <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stat.map((item, index) => {
                return (
                  <div key={index} className='text-center'> 
                    <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent " >
                        {item.value.toLocaleString()  }
                         {item.suffix}
                     </div>
                     <div className=" text-gray-400 uppercase tracking-wider text-sm " >
                        {item.label}
                     </div>
                   </div>
                )
              })}
            </div>
          </div>
      </section>
      <FeaturesSection></FeaturesSection>
      <PricingSection/>
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Create Something Amazing?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who are already using AI to transform
            their images and bring their vision to life.
          </p>
          <Link href="/dashboard">
            <Button variant="primary" size="xl">
              🌟 Start Creating Now
            </Button>
          </Link>
        </div>
      </section>
   </div>
  );
}
