import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Reply, Trash2, Star, Mail, MessageCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Sample inbox data
const sampleMessages = [
  { id: 1,
    sender: 'John Customer',
    email: 'john@example.com',
    subject: 'Order #12345 - Delivery Question',
    preview: 'Hi, I have a question about my recent order...',
    timestamp: '2 hours ago',
    isRead: false,
    isStarred: true,
    type: 'order'
  },
  { id: 2,
    sender: 'Sarah Manager',
    email: 'sarah@company.com',
    subject: 'New Product Request',
    preview: 'We would like to discuss adding new products...',
    timestamp: '1 year ago',
    isRead: true,
    isStarred: false,
    type: 'business'
  },
  { id: 3,
    sender: 'Support Team',
    email: 'support@platform.com',
    subject: 'Payment Processed Successfully',
    preview: 'Your payment for order #12340 has been processed...',
    timestamp: '3 days ago',
    isRead: true,
    isStarred: false,
    type: 'system'
  },
  { id: 4,
    sender: 'Mike Supplier',
    email: 'mike@supplier.com',
    subject: 'Inventory Update',
    preview: 'Your requested items are now back in stock...',
    timestamp: '1 week ago',
    isRead: true,
    isStarred: true,
    type: 'inventory'
  },
];

const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredMessages = sampleMessages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || message.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'order': return <Mail className="h-4 w-4 text-blue-500" />;
      case 'business': return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'system': return <Bell className="h-4 w-4 text-orange-500" />;
      case 'inventory': return <Star className="h-4 w-4 text-purple-500" />;
      default: return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMessageTypeBadge = (type) => {
    const colors = {
      order: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      system: 'bg-orange-100 text-orange-800',
      inventory: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
          <p className="text-gray-600">Manage your messages and notifications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <Badge variant="secondary">{filteredMessages.length}</Badge>
                </div>
                
                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === 'order' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('order')}
                    >
                      Orders
                    </Button>
                    <Button
                      variant={filter === 'business' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('business')}
                    >
                      Business
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      } ${!message.isRead ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`} />
                          <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${!message.isRead ? 'font-semibold' : ''}`}>
                              {message.sender}
                            </h3>
                            <div className="flex items-center gap-1">
                              {message.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>
                          </div>
                          
                          <p className={`text-sm ${!message.isRead ? 'font-semibold' : 'text-gray-900'} truncate`}>
                            {message.subject}
                          </p>
                          
                          <p className="text-sm text-gray-600 truncate">
                            {message.preview}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            {getMessageTypeIcon(message.type)}
                            <Badge className={`text-xs ${getMessageTypeBadge(message.type)}`}>
                              {message.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedMessage.sender}`} />
                        <AvatarFallback>{selectedMessage.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold">{selectedMessage.sender}</h2>
                        <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getMessageTypeBadge(selectedMessage.type)}>
                          {selectedMessage.type}
                        </Badge>
                        <span className="text-sm text-gray-500">{selectedMessage.timestamp}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedMessage.preview}
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4 mr-2" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No message selected</h3>
                    <p className="text-gray-600">Choose a message from the list to view its details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;