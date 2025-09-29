import React from 'react';
import { MapPin, Globe, Camera, Route, Plane, Users, Heart } from 'lucide-react';

function AboutPage() {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Interactive Mapping",
      description: "Click anywhere on the map to add new locations and build your travel story visually."
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: "Country Tracking",
      description: "Automatically track visited countries with beautiful visual indicators on the world map."
    },
    {
      icon: <Route className="h-8 w-8 text-purple-600" />,
      title: "Trip Planning",
      description: "Organize your travels into trips and keep track of your adventures chronologically."
    },
    {
      icon: <Camera className="h-8 w-8 text-orange-600" />,
      title: "Memory Keeping",
      description: "Store your travel memories with detailed location information and personal notes."
    }
  ];
return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Your Travel Journey, Visualized
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your travel experiences into an interactive visual story. Track countries you've visited, 
            plan future adventures, and create lasting memories with our intuitive mapping platform.
          </p>
        </div>
      </div>

      

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Map Your Adventures
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform combines intuitive design with powerful features to make tracking 
            and planning your travels both easy and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 
                                       hover:shadow-xl transition-all duration-300 hover:-translate-y-2
                                       group">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg group-hover:scale-110 
                               transition-transform duration-200">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and begin visualizing your travel journey today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Click & Add",
                description: "Simply click anywhere on the interactive map to add a new location to your journey.",
                color: "bg-blue-500"
              },
              {
                step: "02", 
                title: "Organize Trips",
                description: "Group your locations into trips and add details, dates, and personal notes.",
                color: "bg-green-500"
              },
              {
                step: "03",
                title: "Track Progress",
                description: "Watch as visited countries are highlighted and your travel statistics grow.",
                color: "bg-purple-500"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${step.color} 
                               text-white rounded-full text-xl font-bold mb-6`}>
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
