---
title: list
bookCollapseSection: true
weight: 10
---


	subcommands := []keys.Subcommand{
		&keys.ListKeySubcommand{},
		&keys.ExportKeysSubcommand{},
		&keys.ImportKeysSubcommand{},
		&keys.MigrateKeysSubcommand{},
		&keys.ReadKeySubcommand{},
		&keys.DestroyKeySubcommand{},
		&keys.GenerateKeySubcommand{},
		&keys.ExtractClientIDSubcommand{},
	}

# import-keys

`acra-addzone` is a command-line utility that generates new [Zone keys]({{< ref "/acra/security-controls/zones.md" >}}) for AcraBlocks/AcraStructs.

## Command line flags

### Configuration files
