import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "./ui/icons";

function LoginForm() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Login</TabsTrigger>
        <TabsTrigger value="password">Sign up</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login into your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className=" mb-6">
              <Button variant="outline" className="w-full">
                <Icons.google className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Email</Label>
              <Input id="email" placeholder="email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Password</Label>
              <Input id="password" placeholder="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>Sign up for a new account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className=" mb-6">
              <Button variant="outline" className="w-full">
                <Icons.google className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="current">Email</Label>
              <Input id="email" placeholder="email" type="email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">Password</Label>
              <Input id="password" placeholder="password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Signup</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default LoginForm;
