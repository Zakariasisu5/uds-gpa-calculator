
import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="gpa-gradient py-6 mb-6 shadow-md relative">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-center">About UDS GPA Calculator</h1>
          </div>
          <div className="absolute right-4 top-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pb-16">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Calculator
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">About the Founder</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Founder</h3>
              <p className="text-muted-foreground">Zakaria Sisu</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Background</h3>
              <p className="text-muted-foreground">Computer Science Student at University for Development Studies (UDS)</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Contact Information</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Email: <a href="mailto:zakariasisu5@gmail.com" className="text-primary hover:underline">zakariasisu5@gmail.com</a></li>
                <li>Phone: <a href="tel:+233555212491" className="text-primary hover:underline">+233 555 212491</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">About This App</h3>
              <p className="text-muted-foreground">
                The UDS GPA Calculator was created to help students at the University for Development Studies
                quickly and accurately calculate their Grade Point Average. The application uses the UDS grading
                system (A+ = 5.0, A = 4.5, B+ = 4.0, etc.) to provide accurate calculations.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} UDS GPA Calculator | Built by Zakaria Sisu
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
