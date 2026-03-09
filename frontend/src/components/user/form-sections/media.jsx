import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Image as ImageIcon, Upload, User, FileText, X} from "lucide-react";

export default function UserMediaSection({previewImage, previewSignature, handleFileChange, removeImage}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5"/>
                    Media & Signature
                </CardTitle>
                <CardDescription>Upload foto profil dan tanda tangan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Profile Picture */}
                    <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex flex-col items-center gap-4">
                            {previewImage ? (
                                <div className="relative">
                                    <Avatar className="h-32 w-32">
                                        <AvatarImage src={previewImage} alt="Preview"/>
                                        <AvatarFallback>Preview</AvatarFallback>
                                    </Avatar>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                        onClick={() => removeImage('profile_picture')}
                                    >
                                        <X className="h-3 w-3"/>
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted">
                                    <User className="h-12 w-12 text-muted-foreground/50"/>
                                </div>
                            )}
                            <Label htmlFor="profile_picture" className="cursor-pointer">
                                <div
                                    className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                                    <Upload className="h-4 w-4"/>
                                    Choose Image
                                </div>
                                <Input
                                    id="profile_picture"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => handleFileChange(e, 'profile_picture')}
                                />
                            </Label>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="space-y-2">
                        <Label>Signature</Label>
                        <div className="flex flex-col items-center gap-4">
                            {previewSignature ? (
                                <div className="relative">
                                    <div className="h-32 w-full rounded-lg border-2 border-border bg-muted p-2">
                                        <img
                                            src={previewSignature}
                                            alt="Signature preview"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                        onClick={() => removeImage('signature')}
                                    >
                                        <X className="h-3 w-3"/>
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted">
                                    <FileText className="h-12 w-12 text-muted-foreground/50"/>
                                </div>
                            )}
                            <Label htmlFor="signature" className="cursor-pointer">
                                <div
                                    className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                                    <Upload className="h-4 w-4"/>
                                    Upload Signature
                                </div>
                                <Input
                                    id="signature"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => handleFileChange(e, 'signature')}
                                />
                            </Label>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}