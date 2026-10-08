---
locale: ja
translation:
  source: en
glossary: [daiwa-house, frameworx, wms, wcs, logistics-shortage]
code: P01
title: 次世代WMS
summary: 次世代倉庫管理システム（WMS）の技術計画とアーキテクチャ。担当範囲はアプリケーション各層、クラウド、セキュリティ、倉庫制御システムとの連携にまたがります。
role: テックリード
organization: 株式会社フレームワークス（大和ハウスグループ）
startDate: '2026-09'
endDate: null
status: active
domains: [物流, 倉庫管理, エンタープライズソフトウェア]
capabilities: [architecture, security, integration, standards]
technologies: []
featured: true
order: 1
publicVisibility: anonymized
depth: brief
heroVariant: scope-map
sourceNote: facts.md — Current role (publicly approved scope from CV). No product, roadmap, or architecture detail is approved.
diagram:
  caption: 技術的な責任範囲を示した図です。システムアーキテクチャそのものではなくスコープの範囲図であり、アーキテクチャは非公開です。
  layers:
    - label: アプリケーション
      items: [フロントエンド, バックエンド]
    - label: プラットフォーム
      items: [クラウド, セキュリティ]
    - label: 連携
      items: [WMS/WCS連携]
    - label: 技術ガバナンス
      items:
        [
          技術選定,
          アーキテクチャ標準,
          開発ガイドライン,
          アーキテクチャ決定,
          技術PoC,
        ]
---

## 00 / 概要

2026年9月、大和ハウスグループの株式会社フレームワークスに、次世代倉庫管理システム（WMS）のテックリードとして参画しました。WMSは、入荷、保管、ピッキング、出荷といった倉庫内の業務を動かすシステムです。通常は、自動機器を制御する倉庫制御システム（WCS）と、指示や状態をやり取りする必要があります。

本プロジェクトは進行中です。プロダクトの詳細、アーキテクチャ、提供時期は公開されていないため、ここでは責任範囲のみを記載します。

## 01 / 責任範囲

担当範囲は、フロントエンド、バックエンド、クラウド、セキュリティの各層にわたる技術計画とアーキテクチャ、そしてWMSとWCSの連携境界です。

## 02 / 業務範囲

- 技術選定。
- アーキテクチャ標準化と開発ガイドラインの策定。
- アーキテクチャ決定。
- PoC（技術検証）。
