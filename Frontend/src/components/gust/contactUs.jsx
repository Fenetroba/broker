import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Header from './Header';

// import { sendMessage } from '../../redux/features/messageSlice'; // Uncomment and adjust path if you have this action

const ContactUs = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Example: format message for inbox system
      const messageData = {
        subject: formData.subject,
        content: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
        recipient: 'admin',
        sender: {
          username: formData.name,
          email: formData.email
        }
      };
      // await dispatch(sendMessage(messageData)).unwrap(); // Uncomment if you have this action
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Header />
      <div className="min-h-screen bg-primary/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Contact Us</h1>
            <p className="mt-4 text-lg text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">support@FasionLink.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+251900000000000000</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      batu<br />
                  
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="font-medium text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="What is this regarding?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    rows={4}
                    placeholder="Your message here..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[var(--two2m)] text-white hover:bg-black"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                    
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center cursor-pointer">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;