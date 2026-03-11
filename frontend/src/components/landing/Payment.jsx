import { memo } from "react";

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Best option for personal use & your next project",
    features: [
      "Individual configuration",
      "No setup, or hidden fees",
      "Team size: 1 developer",
      "Premium support: 6 months",
      "Free updates: 6 months"
    ]
  },
  {
    name: "Company",
    price: 99,
    description: "Relevant for multiple users and premium support",
    features: [
      "Individual configuration",
      "No setup, or hidden fees",
      "Team size: 10 developers",
      "Premium support: 24 months",
      "Free updates: 24 months"
    ]
  },
  {
    name: "Enterprise",
    price: 499,
    description: "Best for large scale teams and redistribution",
    features: [
      "Individual configuration",
      "No setup, or hidden fees",
      "Team size: 100+ developers",
      "Premium support: 36 months",
      "Free updates: 36 months"
    ]
  }
];

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-400 flex-shrink-0"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 
      8a1 1 0 01-1.414 0l-4-4a1 
      1 0 011.414-1.414L8 
      12.586l7.293-7.293a1 
      1 0 011.414 0z"
    />
  </svg>
);

function Payments() {
  return (
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">

        {/* Header */}

        <div className="mx-auto max-w-screen-md text-center mb-8">
          <h2 className="mb-4 text-4xl font-extrabold">
            Designed for business teams like yours
          </h2>

          <p className="text-gray-400 sm:text-xl">
            Swift focuses on markets where technology and innovation
            unlock long-term value and growth.
          </p>
        </div>

        {/* Plans */}

        <div className="grid lg:grid-cols-3 gap-8">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col p-6 mx-auto max-w-lg text-center bg-white rounded-lg border border-gray-100 shadow"
            >
              <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>

              <p className="text-gray-400 sm:text-lg">
                {plan.description}
              </p>

              <div className="flex justify-center items-baseline my-8">
                <span className="text-5xl font-extrabold mr-2">
                  ${plan.price}
                </span>
                <span className="text-gray-400">/month</span>
              </div>

              <ul className="space-y-4 mb-8 text-left">

                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}

              </ul>

              <button className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2.5 text-sm font-medium">
                Get started
              </button>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default memo(Payments);