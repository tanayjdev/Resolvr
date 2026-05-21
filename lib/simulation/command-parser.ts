// ============================================================
// lib/simulation/command-parser.ts
// Realistic terminal command handling for PathWeaver
// ============================================================

import type {
    ParsedCommand,
    CommandResult,
    TerminalHistoryLine,
    CommandCategory,
  } from "./types"
  
  // ─── Helpers ──────────────────────────────────────────────────────────────────
  
  function line(
    text: string,
    variant: TerminalHistoryLine["variant"] = "default"
  ): TerminalHistoryLine {
    return { text, variant }
  }
  
  function ts(): string {
    return new Date().toISOString().replace("T", " ").slice(0, 19)
  }
  
  // ─── Parser ───────────────────────────────────────────────────────────────────
  
  export function parseCommand(raw: string): ParsedCommand {
    const trimmed = raw.trim()
    const tokens = trimmed.split(/\s+/)
    const program = tokens[0] ?? ""
  
    const flags: Record<string, string | boolean> = {}
    const args: string[] = []
  
    let i = 1
    while (i < tokens.length) {
      const t = tokens[i]
      if (t.startsWith("--")) {
        const key = t.slice(2)
        const next = tokens[i + 1]
        if (next && !next.startsWith("-")) {
          flags[key] = next
          i += 2
        } else {
          flags[key] = true
          i++
        }
      } else if (t.startsWith("-") && t.length === 2) {
        const key = t.slice(1)
        const next = tokens[i + 1]
        if (next && !next.startsWith("-")) {
          flags[key] = next
          i += 2
        } else {
          flags[key] = true
          i++
        }
      } else {
        args.push(t)
        i++
      }
    }
  
    const category = detectCategory(program)
    const sub = args[0] ?? ""
  
    return { raw: trimmed, category, sub, args, flags }
  }
  
  function detectCategory(program: string): CommandCategory {
    const map: Record<string, CommandCategory> = {
      kubectl: "kubectl",
      systemctl: "systemctl",
      journalctl: "journalctl",
      ping: "network",
      curl: "curl",
      wget: "curl",
    }
    return map[program] ?? "unknown"
  }
  
  // ─── Command Handlers ─────────────────────────────────────────────────────────
  
  // kubectl get nodes
  function handleKubectlGetNodes(): CommandResult {
    return {
      lines: [
        line(
          "NAME           STATUS     ROLES    AGE   VERSION",
          "muted"
        ),
        line("node-east-1a   NotReady   worker   45d   v1.28.2", "error"),
        line("node-east-1b   NotReady   worker   45d   v1.28.2", "error"),
        line("node-east-1c   NotReady   worker   45d   v1.28.2", "error"),
        line("node-west-2a   Ready      worker   45d   v1.28.2", "success"),
        line("node-west-2b   Ready      worker   45d   v1.28.2", "success"),
      ],
      scoreDelta: 15,
      isRelevant: true,
      feedback: {
        type: "correct",
        message: "Good — verifying cluster node states is the right first step.",
        createdAt: Date.now(),
      },
    }
  }
  
  // kubectl get pods --all-namespaces / -A
  function handleKubectlGetPods(): CommandResult {
    return {
      lines: [
        line(
          "NAMESPACE     NAME                        READY   STATUS             RESTARTS   AGE",
          "muted"
        ),
        line(
          "kube-system   coredns-5d6d5d7b5f-abcde    1/1     Running            0          45d",
          "success"
        ),
        line(
          "kube-system   kube-proxy-east-1a          0/1     CrashLoopBackOff   14         2h",
          "error"
        ),
        line(
          "kube-system   kube-proxy-east-1b          0/1     CrashLoopBackOff   14         2h",
          "error"
        ),
        line(
          "kube-system   kube-proxy-east-1c          0/1     CrashLoopBackOff   14         2h",
          "error"
        ),
        line(
          "production    auth-api-6f9b8c-xz9d2       0/1     Pending            0          47m",
          "error"
        ),
        line(
          "production    payment-svc-784d9-k2p3l     1/1     Running            2          45d",
          "success"
        ),
      ],
      scoreDelta: 18,
      isRelevant: true,
      feedback: {
        type: "correct",
        message:
          "kube-proxy CrashLoopBackOff on all east nodes confirms networking layer failure.",
        createdAt: Date.now(),
      },
    }
  }
  
  // kubectl describe node <name>
  function handleKubectlDescribeNode(nodeName: string): CommandResult {
    const resolvedName =
      nodeName ||
      "node-east-1a"
    const isAffected = resolvedName.includes("east")
  
    const lines: TerminalHistoryLine[] = [
      line(`Name:               ${resolvedName}`, "muted"),
      line(
        `Status:             ${isAffected ? "NotReady" : "Ready"}`,
        isAffected ? "error" : "success"
      ),
      line("Roles:              worker", "muted"),
      line("CreationTimestamp:  Mon, 06 Nov 2023 09:12:44 +0000", "muted"),
      line("", "default"),
      line("Conditions:", "muted"),
      line(
        `  NetworkUnavailable   ${isAffected ? "True" : "False"}     ${ts()}`,
        isAffected ? "error" : "success"
      ),
      line(
        `  MemoryPressure       False    ${ts()}`,
        "success"
      ),
      line(
        `  DiskPressure         False    ${ts()}`,
        "success"
      ),
      line(
        `  PIDPressure          False    ${ts()}`,
        "success"
      ),
      line(
        `  Ready                ${isAffected ? "False" : "True"}     ${ts()}`,
        isAffected ? "error" : "success"
      ),
    ]
  
    if (isAffected) {
      lines.push(
        line("", "default"),
        line("Events:", "muted"),
        line(
          `  ${ts()}  Warning  NodeNotReady   kubelet, ${resolvedName}  Node ${resolvedName} status is now: NodeNotReady`,
          "error"
        ),
        line(
          `  ${ts()}  Warning  NetworkPlugin  kubelet, ${resolvedName}  Network plugin returns error: cni plugin not initialized`,
          "error"
        ),
        line(
          `  ${ts()}  Warning  Rebooted       kubelet, ${resolvedName}  Node ${resolvedName} has been rebooted, boot id: a3b91f`,
          "error"
        )
      )
    }
  
    return {
      lines,
      scoreDelta: isAffected ? 20 : 5,
      isRelevant: true,
      feedback: isAffected
        ? {
            type: "correct",
            message: `NetworkUnavailable=True and CNI plugin failure on ${resolvedName} — strong root-cause signal.`,
            createdAt: Date.now(),
          }
        : undefined,
    }
  }
  
  // kubectl get events --sort-by=.metadata.creationTimestamp
  function handleKubectlGetEvents(): CommandResult {
    return {
      lines: [
        line(
          "LAST SEEN   TYPE      REASON             OBJECT                    MESSAGE",
          "muted"
        ),
        line(
          `2m          Warning   NodeNotReady       node/node-east-1a         Node node-east-1a status is now: NodeNotReady`,
          "error"
        ),
        line(
          `2m          Warning   NodeNotReady       node/node-east-1b         Node node-east-1b status is now: NodeNotReady`,
          "error"
        ),
        line(
          `2m          Warning   NodeNotReady       node/node-east-1c         Node node-east-1c status is now: NodeNotReady`,
          "error"
        ),
        line(
          `90s         Warning   FailedMount        pod/auth-api-6f9b8c       MountVolume.SetUp failed: connection refused`,
          "error"
        ),
        line(
          `60s         Normal    ScalingReplicaSet  deploy/payment-svc        Scaled up replica set to 3`,
          "success"
        ),
      ],
      scoreDelta: 15,
      isRelevant: true,
      feedback: {
        type: "correct",
        message:
          "Cluster events confirm simultaneous failure across all east-1 nodes — likely an AZ-level issue.",
        createdAt: Date.now(),
      },
    }
  }
  
  // kubectl cordon / drain
  function handleKubectlCordon(nodeName: string): CommandResult {
    const name = nodeName || "node-east-1a"
    return {
      lines: [line(`node/${name} cordoned`, "success")],
      scoreDelta: 12,
      isRelevant: true,
      feedback: {
        type: "correct",
        message: `Cordoning ${name} prevents new pods from scheduling onto a degraded node. Good remediation step.`,
        createdAt: Date.now(),
      },
    }
  }
  
  function handleKubectlDrain(nodeName: string): CommandResult {
    const name = nodeName || "node-east-1a"
    return {
      lines: [
        line(`node/${name} already cordoned`, "muted"),
        line(`evicting pod production/auth-api-6f9b8c-xz9d2`, "muted"),
        line(`evicting pod kube-system/kube-proxy-east-1a`, "muted"),
        line(`pod/auth-api-6f9b8c-xz9d2 evicted`, "success"),
        line(`pod/kube-proxy-east-1a evicted`, "success"),
        line(`node/${name} drained`, "success"),
      ],
      scoreDelta: 20,
      isRelevant: true,
      feedback: {
        type: "correct",
        message: `Draining ${name} migrates workloads to healthy nodes. Excellent remediation.`,
        createdAt: Date.now(),
      },
    }
  }
  
  // kubectl logs
  function handleKubectlLogs(resourceName: string): CommandResult {
    const resource = resourceName || "kube-proxy-east-1a"
    return {
      lines: [
        line(`${ts()} E0521 14:23:01.445112       1 proxier.go:781] Failed to execute iptables-restore: exit status 1`, "error"),
        line(`${ts()} W0521 14:23:01.446001       1 proxier.go:595] Not syncing iptables rules.`, "error"),
        line(`${ts()} E0521 14:23:01.450088       1 node_handler.go:77] CNI network not ready: cni plugin not initialized`, "error"),
        line(`${ts()} I0521 14:23:02.112009       1 server.go:225] Starting kube-proxy`, "muted"),
      ],
      scoreDelta: 18,
      isRelevant: true,
      feedback: {
        type: "correct",
        message: "CNI plugin not initialized is the root cause — the container network interface failed on boot.",
        createdAt: Date.now(),
      },
    }
  }
  
  // systemctl status kubelet
  function handleSystemctlStatus(service: string): CommandResult {
    const svc = service || "kubelet"
    const isKubelet = svc === "kubelet"
    return {
      lines: [
        line(`● ${svc}.service - ${isKubelet ? "kubelet: The Kubernetes Node Agent" : svc}`, "muted"),
        line(`   Loaded: loaded (/lib/systemd/system/${svc}.service; enabled; vendor preset: enabled)`, "muted"),
        line(
          isKubelet
            ? "   Active: active (running) since Mon 2024-05-21 14:20:11 UTC; 4min ago"
            : `   Active: failed (Result: exit-code) since Mon 2024-05-21 14:22:01 UTC; 2min ago`,
          isKubelet ? "success" : "error"
        ),
        ...(isKubelet
          ? [
              line(`  Process: ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS`, "muted"),
              line(`May 21 14:23:01 node-east-1a kubelet[1024]: E0521 CNI plugin not initialized`, "error"),
              line(`May 21 14:23:02 node-east-1a kubelet[1024]: W0521 node not registered`, "error"),
            ]
          : [
              line(`May 21 14:22:01 node-east-1a ${svc}[2048]: failed to start: connection refused`, "error"),
            ]),
      ],
      scoreDelta: isKubelet ? 15 : 5,
      isRelevant: isKubelet,
      feedback: isKubelet
        ? {
            type: "correct",
            message: "kubelet is running but logging CNI errors — the issue is in the CNI plugin layer, not the kubelet itself.",
            createdAt: Date.now(),
          }
        : undefined,
    }
  }
  
  function handleSystemctlRestart(service: string): CommandResult {
    const svc = service || "kubelet"
    return {
      lines: [
        line(`Restarting ${svc}...`, "muted"),
        line(`${svc} restarted successfully`, "success"),
      ],
      scoreDelta: svc === "kubelet" ? 10 : -5,
      isRelevant: svc === "kubelet",
      feedback:
        svc !== "kubelet"
          ? {
              type: "warning",
              message: `Restarting ${svc} without diagnosis risks masking the root cause.`,
              createdAt: Date.now(),
            }
          : undefined,
    }
  }
  
  // journalctl -u kubelet
  function handleJournalctl(flags: Record<string, string | boolean>): CommandResult {
    const unit = (flags["u"] as string) || "kubelet"
    const hasFollow = Boolean(flags["f"] || flags["follow"])
  
    return {
      lines: [
        line(`-- Logs begin at Mon 2024-05-21 14:00:01 UTC. --`, "muted"),
        line(`May 21 14:20:11 node-east-1a systemd[1]: Started kubelet.`, "success"),
        line(`May 21 14:22:58 node-east-1a kubelet[1024]: E0521 networkPlugin cni failed on the status hook for pod "auth-api": Error waiting for IPAM plugin to return the default network's IPv4 configuration`, "error"),
        line(`May 21 14:23:00 node-east-1a kubelet[1024]: E0521 RunPodSandbox from runtime service failed: rpc error: code = Unknown desc = failed to setup network for sandbox "abc123": CNI plugin not initialized`, "error"),
        line(`May 21 14:23:01 node-east-1a kubelet[1024]: E0521 Unable to update cni config: no networks found in /etc/cni/net.d`, "error"),
        ...(hasFollow ? [line(`(streaming — press Ctrl+C to exit)`, "muted")] : []),
      ],
      scoreDelta: 22,
      isRelevant: true,
      feedback: {
        type: "correct",
        message: "Journalctl confirms: CNI config directory /etc/cni/net.d is empty — CNI was not initialized after node reboot.",
        createdAt: Date.now(),
      },
    }
  }
  
  // ping gateway
  function handlePing(host: string): CommandResult {
    const target = host || "10.0.0.1"
    const isGateway = host === "gateway" || host === "10.0.0.1"
    const success = !isGateway
  
    return {
      lines: [
        line(`PING ${target} (${isGateway ? "10.0.0.1" : target}): 56 data bytes`, "muted"),
        ...(success
          ? [
              line(`64 bytes from ${target}: icmp_seq=0 ttl=64 time=0.412 ms`, "success"),
              line(`64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.388 ms`, "success"),
              line(`64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.401 ms`, "success"),
              line(`3 packets transmitted, 3 received, 0% packet loss`, "success"),
            ]
          : [
              line(`Request timeout for icmp_seq 0`, "error"),
              line(`Request timeout for icmp_seq 1`, "error"),
              line(`Request timeout for icmp_seq 2`, "error"),
              line(`3 packets transmitted, 0 received, 100% packet loss`, "error"),
            ]),
      ],
      scoreDelta: isGateway ? 12 : 3,
      isRelevant: isGateway,
      feedback: isGateway
        ? {
            type: success ? "correct" : "warning",
            message: success
              ? "Gateway reachable — network layer is up. Issue is above L3."
              : "Gateway unreachable — confirms east-1 AZ network isolation.",
            createdAt: Date.now(),
          }
        : undefined,
    }
  }
  
  // curl health endpoint
  function handleCurl(url: string, flags: Record<string, string | boolean>): CommandResult {
    const isInternal =
      url?.includes("localhost") ||
      url?.includes("10.") ||
      url?.includes("health") ||
      url?.includes("readyz") ||
      url?.includes("livez")
    const isSilent = Boolean(flags["s"] || flags["silent"])
  
    return {
      lines: isInternal
        ? [
            ...(!isSilent ? [line(`  % Total    % Received % Xferd  Average Speed   Time`, "muted")] : []),
            line(`curl: (7) Failed to connect to ${url ?? "localhost"} port 8080 after 30006 ms: Connection refused`, "error"),
          ]
        : [
            line(`{"status":"error","message":"upstream connect error or disconnect/reset before headers","code":503}`, "error"),
          ],
      scoreDelta: isInternal ? 10 : 2,
      isRelevant: isInternal,
      feedback: isInternal
        ? {
            type: "correct",
            message: "Health endpoint unreachable — confirms service-level impact beyond just node status.",
            createdAt: Date.now(),
          }
        : undefined,
    }
  }
  
  // ─── Main Dispatcher ──────────────────────────────────────────────────────────
  
  export function executeCommand(raw: string): CommandResult {
    const cmd = parseCommand(raw)
  
    if (!raw.trim()) {
      return { lines: [], scoreDelta: 0, isRelevant: false }
    }
  
    // ── kubectl ──
    if (cmd.category === "kubectl") {
      const sub = cmd.args[0]
      const resource = cmd.args[1]
      const target = cmd.args[2]
  
      if (sub === "get") {
        if (resource === "nodes") return handleKubectlGetNodes()
        if (resource === "pods") return handleKubectlGetPods()
        if (resource === "events") return handleKubectlGetEvents()
        return unknownSubcommand(`kubectl get ${resource}`)
      }
      if (sub === "describe") {
        if (resource === "node") return handleKubectlDescribeNode(target)
        return unknownSubcommand(`kubectl describe ${resource}`)
      }
      if (sub === "logs") return handleKubectlLogs(resource)
      if (sub === "cordon") return handleKubectlCordon(resource)
      if (sub === "drain") return handleKubectlDrain(resource)
      if (sub === "uncordon") {
        return {
          lines: [line(`node/${resource || "node-east-1a"} uncordoned`, "success")],
          scoreDelta: 5,
          isRelevant: false,
        }
      }
      return unknownSubcommand(`kubectl ${sub}`)
    }
  
    // ── systemctl ──
    if (cmd.category === "systemctl") {
      const sub = cmd.args[0]
      const svc = cmd.args[1] || "kubelet"
      if (sub === "status") return handleSystemctlStatus(svc)
      if (sub === "restart") return handleSystemctlRestart(svc)
      if (sub === "start") {
        return {
          lines: [line(`Started ${svc}`, "success")],
          scoreDelta: 5,
          isRelevant: false,
        }
      }
      if (sub === "stop") {
        return {
          lines: [
            line(`Stopped ${svc}`, "error"),
            line(`Warning: stopping ${svc} may disrupt pod scheduling`, "error"),
          ],
          scoreDelta: -10,
          isRelevant: false,
          feedback: {
            type: "warning",
            message: `Stopping ${svc} without a rollback plan can worsen the incident.`,
            createdAt: Date.now(),
          },
        }
      }
      return unknownSubcommand(`systemctl ${sub}`)
    }
  
    // ── journalctl ──
    if (cmd.category === "journalctl") return handleJournalctl(cmd.flags)
  
    // ── network ──
    if (cmd.category === "network") return handlePing(cmd.args[0])
  
    // ── curl ──
    if (cmd.category === "curl") return handleCurl(cmd.args[0], cmd.flags)
  
    // ── built-ins ──
    if (raw.trim() === "clear") {
      return { lines: [{ text: "__CLEAR__" }], scoreDelta: 0, isRelevant: false }
    }
    if (raw.trim() === "help") {
      return {
        lines: [
          line("Available commands:", "muted"),
          line("  kubectl get nodes|pods|events", "default"),
          line("  kubectl describe node <name>", "default"),
          line("  kubectl logs <pod-name>", "default"),
          line("  kubectl cordon|drain|uncordon <node>", "default"),
          line("  systemctl status|restart|stop <service>", "default"),
          line("  journalctl -u <service> [-f]", "default"),
          line("  ping <host>", "default"),
          line("  curl <url>", "default"),
        ],
        scoreDelta: 0,
        isRelevant: false,
      }
    }
  
    // Unknown
    return {
      lines: [
        line(
          `bash: ${raw.split(" ")[0]}: command not found. Type 'help' for available commands.`,
          "error"
        ),
      ],
      scoreDelta: -5,
      isRelevant: false,
      feedback: {
        type: "warning",
        message: `Command not recognised: "${raw.split(" ")[0]}". Focus on kubectl, systemctl, journalctl, ping, or curl.`,
        createdAt: Date.now(),
      },
    }
  }
  
  function unknownSubcommand(attempt: string): CommandResult {
    return {
      lines: [
        line(`Error: unknown command "${attempt}". Type 'help' for available commands.`, "error"),
      ],
      scoreDelta: -3,
      isRelevant: false,
    }
  }
  