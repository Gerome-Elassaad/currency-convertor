"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
}

export default function Modal({
	isOpen,
	onClose,
	children,
	title = "Dialog",
}: ModalProps) {
	return (
		<Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm animate-fadeIn data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-white rounded-lg shadow-2xl animate-scaleIn data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut focus:outline-none">
					<VisuallyHidden.Root>
						<Dialog.Title>{title}</Dialog.Title>
					</VisuallyHidden.Root>
					<Dialog.Close asChild>
						<button
							type="button"
							className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
							aria-label="Close"
						>
							<X className="w-6 h-6 text-gray-600" />
						</button>
					</Dialog.Close>
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
