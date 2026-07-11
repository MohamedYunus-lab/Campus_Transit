import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const faqs = [
    {
      question: "How do I find which bus goes to my area?",
      answer: "You can use the search bar on the Home page to search by your area name, or browse the 'Routes' page to see all available boarding points and their corresponding buses."
    },
    {
      question: "What should I do if I miss my bus?",
      answer: "If you miss your assigned bus, check the live tracking on the Home page to see if another bus on the same route is still approaching. Otherwise, you will need to arrange your own alternative transportation to the college."
    },
    {
      question: "Is it mandatory to show my college ID card while boarding?",
      answer: "Yes. For security reasons, you must present your valid college ID card to the bus driver or coordinator when boarding the bus."
    },
    {
      question: "Who do I contact if I left something on the bus?",
      answer: "If you left an item on the bus, check the 'Driver Information' section on the specific bus's detail page. You can contact the driver directly, or reach out to the college transport administration desk."
    },
    {
      question: "Are the arrival times exact?",
      answer: "The arrival and departure times shown are estimates based on standard traffic conditions. We recommend arriving at your boarding point at least 5-10 minutes before the scheduled arrival time."
    },
    {
      question: "Can I board a different bus if my regular bus is full?",
      answer: "Yes, provided the alternative bus serves your route and has available seating capacity. Priority is always given to students assigned to that specific bus."
    }
  ];

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-headline-lg font-bold text-gray-900 mb-4">Help & FAQ</h1>
          <p className="text-body-lg text-gray-600">
            Find answers to common questions about Sairam Bus Connect and campus transit.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="card border border-gray-100 hover:border-primary-200 transition-colors overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-gray-900 text-left">{faq.question}</span>
                <svg 
                  className={`w-6 h-6 text-primary transition-transform duration-200 ${openIndex === index ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 py-4 border-t border-gray-100' : 'max-h-0 py-0'}`}
              >
                <p className="text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="bg-primary px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Report an Issue / Submit a Complaint</h2>
            <p className="text-primary-100">Facing a problem with the bus or the web portal? Let us know.</p>
          </div>
          
          <div className="p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complaint Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6">Thank you for letting us know. Our transport administration team will look into this issue.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-semibold hover:underline"
                >
                  Submit another issue
                </button>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student ID / Roll No</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                      placeholder="e.g. 21CS001"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-white"
                  >
                    <option value="">Select an issue type...</option>
                    <option value="bus_late">Bus Arrived Late</option>
                    <option value="bus_full">Bus Was Full</option>
                    <option value="driver_behavior">Driver/Staff Behavior</option>
                    <option value="app_bug">Web Portal Bug/Error</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Describe the Issue</label>
                  <textarea 
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none"
                    placeholder="Please provide details about the problem you faced..."
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit Complaint
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
