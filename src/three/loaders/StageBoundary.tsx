"use client";

import { Component, type ReactNode } from "react";

interface Props { fallback: ReactNode; onError?: (e: Error) => void; children: ReactNode }
interface State { failed: boolean }

/** Catches GLB 404s / WebGL context errors so the page never shows a blank hole. */
export class StageBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.onError?.(error); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
