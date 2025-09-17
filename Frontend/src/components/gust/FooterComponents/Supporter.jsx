import React, { useState } from 'react';
import { FiMail, FiPhone, FiMessageSquare, FiHelpCircle, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
const Supporter = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'How do I add a new product?',
      answer: 'To add a new product, go to the Products section and click on the "Add Product" button.'
    },
    {
      question: 'How do I manage user accounts?',
      answer: 'User accounts can be managed from the Users section in the admin panel.'
    },
    {
      question: 'How do I process orders?',
      answer: 'Orders can be processed from the Orders section where you can view and update order status.'
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Your support request has been submitted. We will get back to you soon!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="px-5">
     
     <Sheet>
    <SheetTrigger asChild>
      <Button className=" hover:text-[var(--two4m)] cursor-pointer">
      Help
      </Button>
    </SheetTrigger>
    <SheetContent side="bottom" className="h-[90vh] overflow-y-auto pb-10 bg-green-50 rounded-2xl sm:p-10 p-3">
    
                
      
    
     <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Help & Support Center</h1>
        <p className="text-gray-600">Find answers to common questions or contact our support team</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'faq' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <FiHelpCircle className="inline mr-2" />
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contact' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <FiMail className="inline mr-2" />
            Contact Support
          </button>
        </div>
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                className="w-full flex justify-between items-center text-left py-3 focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                {expandedFaq === index ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {expandedFaq === index && (
                <div className="mt-2 text-gray-600 pb-2">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Our Support Team</h2>
          <p className="text-gray-600 mb-6">Fill out the form below and our team will get back to you as soon as possible.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--two2m)] text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Message
              </button>
            </div>
          </form>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Other ways to reach us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiMail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">Email us</h4>
                  <p className="mt-1 text-sm text-gray-500">support@brokerapp.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiPhone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">Call us</h4>
                  <p className="mt-1 text-sm text-gray-500">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </SheetContent>
      </Sheet>
    </div>
  );
};

export default Supporter;
