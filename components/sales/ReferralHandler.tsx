import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ReferralHandler = () => {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [showReferralConfirmation, setShowReferralConfirmation] = useState(false);
    const [referralCode, setReferralCode] = useState<string | null>(null);

    useEffect(() => {
        const refCode = searchParams.get('ref');
        if (refCode) {
            // Instead of automatically saving, prompt for confirmation
            setReferralCode(refCode);
            setShowReferralConfirmation(true);
        }
    }, [searchParams]);

    const handleAcceptReferral = () => {
        if (referralCode) {
            localStorage.setItem('referralCode', referralCode);

            toast({
                title: "Referral Link Applied",
                description: `Referral code ${referralCode} has been saved`,
            });
        }
        setShowReferralConfirmation(false);
    };

    const handleDeclineReferral = () => {
        toast({
            title: "Referral Declined",
            description: "Referral code was not saved",
            variant: "destructive"
        });
        setShowReferralConfirmation(false);
    };

    return (
        <AlertDialog open={showReferralConfirmation} onOpenChange={setShowReferralConfirmation}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Referral Link Detected</AlertDialogTitle>
                    <AlertDialogDescription>
                        A referral link from {referralCode} has been found. Would you like to apply this referral code to your purchase?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleDeclineReferral}>
                        Decline
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleAcceptReferral}>
                        Accept Referral
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ReferralHandler;