
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { FileSearch, UserRound, LogOut, BookOpen, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check for the current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getCurrentUser();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing out.",
        variant: "destructive",
      });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <nav className="border-b border-gray-200 py-4 px-4 md:px-6 bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <FileSearch size={28} className="text-resume-primary" />
          <span className="text-xl font-bold text-resume-dark">ResumeGlow</span>
        </Link>
        
        {isMobile ? (
          <>
            <button 
              onClick={toggleMobileMenu} 
              className="text-resume-dark focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {mobileMenuOpen && (
              <div className="fixed inset-0 top-[61px] z-50 bg-white py-4 px-6 flex flex-col gap-4">
                <Link to="/analyze" onClick={toggleMobileMenu}>
                  <Button variant="outline" className="w-full justify-start">Analyze Resume</Button>
                </Link>
                
                {user ? (
                  <>
                    <Link to="/saved-analyses" onClick={toggleMobileMenu}>
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="mr-2 h-4 w-4" /> Saved Analyses
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        handleSignOut();
                        toggleMobileMenu();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={toggleMobileMenu}>
                    <Button className="bg-resume-primary hover:bg-resume-accent w-full">
                      <UserRound className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/analyze">
              <Button variant="outline">Analyze Resume</Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-resume-primary hover:bg-resume-accent">
                    <UserRound className="mr-2 h-4 w-4" />
                    {user.email ? user.email.split('@')[0] : 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/saved-analyses')}>
                    <BookOpen className="mr-2 h-4 w-4" /> Saved Analyses
                  </DropdownMenuItem>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-resume-primary hover:bg-resume-accent">
                  <UserRound className="mr-2 h-4 w-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
