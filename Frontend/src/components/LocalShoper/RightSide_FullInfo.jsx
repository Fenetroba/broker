import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, User, LocateIcon } from "lucide-react";
import {


  Mail,
  Phone,
  MapPin,
  IdCard,
  Building,
  Globe,
  List,
} from "lucide-react";
const RightSide_FullInfo = () => {
  const { selectedFriend } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!selectedFriend) return null;

  return (
    <>
      {isMobile && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="fixed right-4 bottom-4 z-40 bg-[var(--two5m)] p-3 rounded-full shadow-lg md:hidden"
        >
          {isOpen ? <X size={24} /> : <User size={24} />}
        </button>
      )}

      <div 
        className={`fixed  md:relative md:right-0 md:top-0 h-[100vh] shadow-2xl transition-all duration-300 ease-in-out z-30 
          ${isMobile 
            ? `right-0 w-64 bg-white shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}` 
            : 'w-64 bg-[var(--two5m)]'}`}
      >
        <div className="flex flex-col items-center p-4 h-full overflow-y-auto">
          <div className="w-full flex justify-end md:hidden mb-4">
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex flex-col items-center flex-1 w-full">
            <Avatar className='w-20 h-20 border-1'>
              <AvatarImage src={selectedFriend.profilePic} />
              <AvatarFallback>{selectedFriend.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="mt-4 text-center w-full">
              <h1 className="text-lg font-semibold">{selectedFriend.name}</h1>
              <p className="text-sm text-gray-600 break-words mt-1">{selectedFriend.email}</p>
              
              <div className="mt-4 space-y-2 w-full">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-medium ${selectedFriend.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedFriend.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Role:</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">
                    {selectedFriend.role || ''}
                  </span>
                </div>
                <div className="  p-2 backdrop-blur-lg rounded-lg"><Phone/>
                 
                  <span className="text-sm font-medium text-gray-800 capitalize">
                    {selectedFriend.phone || '+251905420124'}
                  </span>
                </div>
                <div className="flex p-2 backdrop-blur-lg rounded-lg"><MapPin/>
                
                  <span className="text-sm font-medium text-gray-800 capitalize">
                    {selectedFriend.address || ''}
                  </span>
                </div>
                <div className="bg-[var(--two2m)] ">
                <div className="flex p-5 text-white rounded-lg"><Building/> <span>Company Name</span>
                
                <span className="text-sm font-medium text-gray-800 capitalize">
                  {selectedFriend.companyName || ''}
                </span>
              </div>
              <div className="flex  p-5 text-white rounded-lg"><Globe/> <span> Website</span>
              
                <span className="text-sm font-medium text-gray-800 capitalize">
                  {selectedFriend.companyWebsite || ''}
                </span>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSide_FullInfo;
